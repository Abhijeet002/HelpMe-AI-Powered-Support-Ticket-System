import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    avatar: {
      type: String, // Cloudinary URL
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);