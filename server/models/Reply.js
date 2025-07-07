import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "agent", "admin"],
      required: true,
    },
    attachment: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  { timestamps: true }
);

export const Reply = mongoose.model("Reply", replySchema);
