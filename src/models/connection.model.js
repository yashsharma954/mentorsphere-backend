import mongoose from "mongoose";

const Connectionschema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

Connectionschema.index({ requester: 1, receiver: 1 }, { unique: true });

export const Connection = mongoose.model("Connection", Connectionschema);