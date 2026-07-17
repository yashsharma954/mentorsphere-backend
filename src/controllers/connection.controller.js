import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Connection } from "../models/connection.model.js";
import { createNotification } from "../utils/createNotification.js";

const sendConnectionRequest = asyncHandler(async (req, res) => {
  const { receiverId, message } = req.body;
  const requesterId = req.user._id;

  if (!receiverId) {
    throw new ApiError(400, "receiverId is required");
  }

  if (receiverId.toString() === requesterId.toString()) {
    throw new ApiError(400, "You cannot send a connection request to yourself");
  }

  const existing = await Connection.findOne({
    requester: requesterId,
    receiver: receiverId,
  });

  if (existing) {
    throw new ApiError(409, "Connection request already exists");
  }

  const connection = await Connection.create({
    requester: requesterId,
    receiver: receiverId,
    message,
  });

  await createNotification({
    user: receiverId,
    type: "connection_request",
    message: `${req.user.fullName} sent you a connection request`,
    relatedId: connection._id,
    relatedModel: "Connection",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, connection, "Connection request sent"));
});

const respondToConnectionRequest = asyncHandler(async (req, res) => {
  const { connectionId } = req.params;
  const { action } = req.body; // "accept" | "reject"

  if (!["accept", "reject"].includes(action)) {
    throw new ApiError(400, "action must be 'accept' or 'reject'");
  }

  const connection = await Connection.findById(connectionId);

  if (!connection) {
    throw new ApiError(404, "Connection request not found");
  }

  if (connection.receiver.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to respond to this request");
  }

  connection.status = action === "accept" ? "accepted" : "rejected";
  await connection.save();

  if (action === "accept") {
    await createNotification({
      user: connection.requester,
      type: "connection_accepted",
      message: `${req.user.fullName} accepted your connection request`,
      relatedId: connection._id,
      relatedModel: "Connection",
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, connection, `Connection ${connection.status}`));
});

const getMyConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const Connections = await Connection.find({
    status: "accepted",
    $or: [{ requester: userId }, { receiver: userId }],
  })
    .populate("requester", "fullName avatar Role branch company")
    .populate("receiver", "fullName avatar Role branch company");

  return res
    .status(200)
    .json(new ApiResponse(200, Connections, "Connections fetched successfully"));
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const requests = await Connection.find({
    receiver: req.user._id,
    status: "pending",
  }).populate("requester", "fullName avatar Role branch company");

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Pending requests fetched successfully"));
});

const getSentRequests = asyncHandler(async (req, res) => {
  const requests = await Connection.find({
    requester: req.user._id,
    status: "pending",
  }).populate("receiver", "fullName avatar Role branch company");

  return res
    .status(200)
    .json(new ApiResponse(200, requests, "Sent requests fetched successfully"));
});

export {
  sendConnectionRequest,
  respondToConnectionRequest,
  getMyConnections,
  getPendingRequests,
  getSentRequests,
};