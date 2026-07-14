import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: String,
    subject: String,
    branch: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "connection-only"],
      default: "public",
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

resourceSchema.index({ branch: 1, subject: 1, visibility: 1 });

export const Resource = mongoose.model("Resource", resourceSchema);