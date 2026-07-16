import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { User } from "../models/user.model.js";
import { createNotification } from "../utils/createNotification.js";

const addAvailableSlot = asyncHandler(async (req, res) => {
  const { day, time } = req.body;

  if (req.user.Role !== "mentor") {
    throw new ApiError(403, "Only mentors can add available slots");
  }

  if (!day || !time) {
    throw new ApiError(400, "day and time are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { availableSlots: { day, time, booked: false } } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user.availableSlots, "Slot added successfully"));
});

const removeAvailableSlot = asyncHandler(async (req, res) => {
  const { slotId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { availableSlots: { _id: slotId } } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user.availableSlots, "Slot removed successfully"));
});

const getMentorSlots = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;

  const mentor = await User.findOne({ _id: mentorId, Role: "mentor" }).select(
    "availableSlots fullName"
  );

  if (!mentor) {
    throw new ApiError(404, "Mentor not found");
  }

  const openSlots = mentor.availableSlots.filter((slot) => !slot.booked);

  return res
    .status(200)
    .json(new ApiResponse(200, openSlots, "Available slots fetched successfully"));
});

const bookSlot = asyncHandler(async (req, res) => {
  const { mentorId, day, time, notes } = req.body;
  const studentId = req.user._id;

  if (!mentorId || !day || !time) {
    throw new ApiError(400, "mentorId, day and time are required");
  }

  const mentor = await User.findOne({ _id: mentorId, Role: "mentor" });

  if (!mentor) {
    throw new ApiError(404, "Mentor not found");
  }

  const slot = mentor.availableSlots.find((s) => s.day === day && s.time === time);

  if (!slot) {
    throw new ApiError(404, "Slot not found");
  }

  if (slot.booked) {
    throw new ApiError(409, "This slot is already booked");
  }

  slot.booked = true;
  await mentor.save();

  const booking = await Booking.create({
    mentor: mentorId,
    student: studentId,
    day,
    time,
    notes,
  });

  await createNotification({
    user: mentorId,
    type: "booking_confirmed",
    message: `${req.user.fullName} booked a session with you on ${day}, ${time}`,
    relatedId: booking._id,
    relatedModel: "Booking",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Session booked successfully"));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isParticipant =
    booking.mentor.toString() === req.user._id.toString() ||
    booking.student.toString() === req.user._id.toString();

  if (!isParticipant) {
    throw new ApiError(403, "You are not Authorized to cancel this booking");
  }

  booking.status = "cancelled";
  await booking.save();

  // Slot ko wapas free karo mentor ke profile mein
  await User.updateOne(
    { _id: booking.mentor, "availableSlots.day": booking.day, "availableSlots.time": booking.time },
    { $set: { "availableSlots.$.booked": false } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

const getMyBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const filter = req.user.Role === "mentor" ? { mentor: userId } : { student: userId };

  const bookings = await Booking.find(filter)
    .populate("mentor", "fullName avatar company")
    .populate("student", "fullName avatar branch")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

export {
  addAvailableSlot,
  removeAvailableSlot,
  getMentorSlots,
  bookSlot,
  cancelBooking,
  getMyBookings,
};