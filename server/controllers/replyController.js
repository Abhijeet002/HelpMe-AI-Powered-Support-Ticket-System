import { Ticket } from "../models/Ticket.js";
import { Reply } from "../models/Reply.js";
import cloudinary from '../config/cloudinary.js';

export const createReply = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isCreator = ticket.createdBy.toString() === req.user.id;
    const isAssignedAgent = ticket.assignedTo?.toString() === req.user.id;

    if (!isAdmin && !isCreator && !isAssignedAgent) {
      return res
        .status(403)
        .json({ message: "Unauthorized to reply to this ticket" });
    }

    const newReply = new Reply({
      ticket: ticketId,
      user: req.user.id,
      senderRole: req.user.role,
      message,
    });

    if (req.file) {
      newReply.attachment = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
    await newReply.save();
    return res
      .status(201)
      .json({ message: "Reply created successfully", reply: newReply });
  } catch (error) {
    console.error("Error creating reply:", error);
    return res.status(500).json({ message: "Failed to post reply" });
  }
};

export const getRepliesForTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { id: userId, role } = req.user;

  try {
    if (!ticketId || ticketId.trim() === "") {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    // Validate ticketId format
    if (!/^[0-9a-fA-F]{24}$/.test(ticketId)) {
      return res.status(400).json({ message: "Invalid Ticket ID format" });
    }

    // Check if the ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only allow creator, assigned agent, or admin to view replies
    const isCreator = ticket.createdBy.toString() === userId;
    const isAgent = ticket.assignedTo?.toString() === userId;
    const isAdmin = role === "admin";
    if (!isCreator && !isAgent && !isAdmin) {
      return res.status(403).json({
        message: "Access denied! Unauthorized to view replies for this ticket",
      });
    }
    const replies = await Reply.find({ ticket: ticketId })
      .sort({ createdAt: -1 })
      .populate("user", "username email role");

    return res.status(200).json({ replies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch replies for this ticket" });
    }
};
  
export const editReply = async (req, res) => {
  const { replyId } = req.params;
  const { message } = req.body;
  const { id: userId, role } = req.user;

  try {
    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    if (reply.user.toString() !== userId && role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to edit this reply" });
    }

    reply.message = message;

    // Replace attachment if new file uploaded
    if (req.file) {
      if (reply.attachment?.public_id) {
        await cloudinary.uploader.destroy(reply.attachment.public_id);
      }

      reply.attachment = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await reply.save();
    return res.status(200).json({ message: "Reply updated successfully", reply });
  } catch (error) {
    console.error("Error updating reply:", error);
    return res.status(500).json({ message: "Failed to update reply" });
  }
};

export const deleteReply = async (req, res) => {
  const { replyId } = req.params;
  const { id: userId, role } = req.user;

  try {
    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    // Only allow the user who created the reply or an admin to delete it
    if (reply.user.toString() !== userId && role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this reply" });
    }

    if (reply.attachment?.public_id) {
      await cloudinary.uploader.destroy(reply.attachment.public_id);
    }
    await reply.deleteOne();
    return res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return res.status(500).json({ message: "Failed to delete reply" });
  }
};
