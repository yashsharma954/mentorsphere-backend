import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resource } from "../models/resource.model.js";
import { Connection } from "../models/connection.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { createNotification } from "../utils/createNotification.js";

const uploadResource = asyncHandler(async (req, res) => {
  const { title, description, subject, branch, visibility } = req.body;
  const fileLocalPath = req.file?.path;

  if (!title || !fileLocalPath) {
    throw new ApiError(400, "Title and file are required");
  }

  const uploadedFile = await uploadOnCloudinary(fileLocalPath);

  if (!uploadedFile?.url) {
    throw new ApiError(400, "Error while uploading file");
  }

  const resource = await Resource.create({
    title,
    description,
    fileUrl: uploadedFile.url,
    fileType: uploadedFile.format,
    subject,
    branch,
    uploadedBy: req.user._id,
    visibility: visibility === "connection-only" ? "connection-only" : "public",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, resource, "Resource uploaded successfully"));
});

const getPublicResources = asyncHandler(async (req, res) => {
  const { branch, subject } = req.query;

  const filter = { visibility: "public" };
  if (branch) filter.branch = branch;
  if (subject) filter.subject = subject;

  const resources = await Resource.find(filter)
    .populate("uploadedBy", "fullName avatar role")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, resources, "Public resources fetched successfully"));
});

const shareResourceWithUser = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const { targetUserId } = req.body;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  if (resource.uploadedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only share resources you uploaded");
  }

  const isConnected = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: req.user._id, receiver: targetUserId },
      { requester: targetUserId, receiver: req.user._id },
    ],
  });

  if (!isConnected) {
    throw new ApiError(403, "You can only share resources with your connections");
  }

  resource.visibility = "connection-only";
  if (!resource.sharedWith.includes(targetUserId)) {
    resource.sharedWith.push(targetUserId);
  }
  await resource.save();

  await createNotification({
    user: targetUserId,
    type: "resource_shared",
    message: `${req.user.fullName} shared a resource with you: "${resource.title}"`,
    relatedId: resource._id,
    relatedModel: "Resource",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, resource, "Resource shared successfully"));
});

const getSharedResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ sharedWith: req.user._id }).populate(
    "uploadedBy",
    "fullName avatar role"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, resources, "Shared resources fetched successfully"));
});

const deleteResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  const isOwner = resource.uploadedBy.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this resource");
  }

  await resource.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Resource deleted successfully"));
});

const downloadResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError(404, "Resource not found");
  }

  const isOwner = resource.uploadedBy.toString() === req.user._id.toString();
  const isSharedWithMe = resource.sharedWith.some(
    (id) => id.toString() === req.user._id.toString()
  );

  if (resource.visibility === "connection-only" && !isOwner && !isSharedWithMe) {
    throw new ApiError(403, "You don't have access to this resource");
  }

  resource.downloadCount += 1;
  await resource.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { fileUrl: resource.fileUrl }, "Download link generated"));
});

export {
  uploadResource,
  getPublicResources,
  shareResourceWithUser,
  getSharedResources,
  deleteResource,
  downloadResource,
};