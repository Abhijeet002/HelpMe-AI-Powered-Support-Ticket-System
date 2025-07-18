import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachment: {
      url: { type: String }, // File access URL
      public_id: { type: String }, // For deleting from Cloudinary
    },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
