import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { Connection } from "../models/connection.model.js";
import { createNotification } from "../utils/createNotification.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user._id;

  if (!receiverId || !content) {
    throw new ApiError(400, "receiverId and content are required");
  }

  // Business rule: sirf accepted connection wale hi chat kar sakte hain
  const isConnected = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: senderId, receiver: receiverId },
      { requester: receiverId, receiver: senderId },
    ],
  });

  if (!isConnected) {
    throw new ApiError(403, "You can only message users you're connected with");
  }

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });

  await createNotification({
    user: receiverId,
    type: "new_message",
    message: `${req.user.fullName} sent you a message`,
    relatedId: message._id,
    relatedModel: "Message",
  });

  return res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

const getConversation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;
  const { page = 1, limit = 30 } = req.query;

  const messages = await Message.find({
    $or: [
      { sender: myId, receiver: userId },
      { sender: userId, receiver: myId },
    ],
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res
    .status(200)
    .json(new ApiResponse(200, messages.reverse(), "Conversation fetched successfully"));
});

// Sidebar list ke liye — har conversation ka last message + unread count
const getAllConversations = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  const conversations = await Message.aggregate([
    { $match: { $or: [{ sender: myId }, { receiver: myId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: { $cond: [{ $eq: ["$sender", myId] }, "$receiver", "$sender"] },
        lastMessage: { $first: "$content" },
        lastMessageAt: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$receiver", myId] }, { $eq: ["$read", false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        "user.fullName": 1,
        "user.avatar": 1,
        "user.role": 1,
        lastMessage: 1,
        lastMessageAt: 1,
        unreadCount: 1,
      },
    },
    { $sort: { lastMessageAt: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, conversations, "Conversations fetched successfully"));
});

const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;

  await Message.updateMany(
    { sender: userId, receiver: myId, read: false },
    { $set: { read: true } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Messages marked as read"));
});

export { sendMessage, getConversation, getAllConversations, markMessagesAsRead };