import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Connection } from "../models/connection.model.js";
import { Booking } from "../models/booking.model.js";
import { Resource } from "../models/resource.model.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const { Role, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (Role) filter.Role = Role;

  const users = await User.find(filter)
    .select("-password -refreshToken")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { users, total, page: Number(page) },
        "Users fetched successfully"
      )
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

// Admin Dashboard overview ke liye
const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalMentors,
    totalRecruiters,
    totalConnections,
    totalBookings,
    totalResources,
  ] = await Promise.all([
    User.countDocuments({ Role: "student" }),
    User.countDocuments({ Role: "mentor" }),
    User.countDocuments({ Role: "recruiter" }),
    Connection.countDocuments({ status: "accepted" }),
    Booking.countDocuments({ status: { $ne: "cancelled" } }),
    Resource.countDocuments(),
  ]);

  const stats = {
    totalStudents,
    totalMentors,
    totalRecruiters,
    totalConnections,
    totalBookings,
    totalResources,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Platform stats fetched successfully"));
});

export { getAllUsers, deleteUser, getPlatformStats };