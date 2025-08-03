import mongoose from "mongoose";
import {Ticket} from "../models/Ticket.js";
import {Reply} from "../models/Reply.js";
import {User} from "../models/User.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  try {
    const user = await User.findById(id).select("-password"); // Exclude password field(projection)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ message: "Failed to fetch user by ID" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const updates = {};

    //  Check if new username is provided and unique
    if (req.body.username) {
      const existingUser = await User.findOne({
        username: req.body.username,
        _id: { $ne: req.user.id }, // exclude self
      });

      if (existingUser) {
        return res.status(400).json({
          message:
            "Username already taken. Try adding a number or underscore to make it unique.",
        });
      }

      updates.username = req.body.username;
    }

    //  Optional: update bio
    if (req.body.bio) {
      updates.bio = req.body.bio;
    }

    //  update avatar (via Cloudinary upload middleware)
    if (req.file) {
      updates.avatar = req.file.path; // Cloudinary returns URL in `file.path`
    }

    // Update user and return new document (excluding password)
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

