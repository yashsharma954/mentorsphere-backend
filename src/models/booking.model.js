import mongoose from "mongoose";

const Bookingschema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
    meetingLink: String,
    notes: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

Bookingschema.index({ mentor: 1, status: 1 });
Bookingschema.index({ student: 1, status: 1 });

export const Booking = mongoose.model("Booking", Bookingschema);