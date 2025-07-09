import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Reply } from "../models/Reply.js";

dotenv.config();

export const createTicket = async (req, res) => {
  const { title, description, priority } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      status: "open", // default status
      createdBy: req.user.id,
      // attachment: req.file?.filename || null,
    });
    if (req.file) {
      ticket.attachment = {
        url: req.file.path, // Cloudinary file URL
        public_id: req.file.filename, // Used to delete from Cloudinary
      };
    }

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while creating the ticket" });
  }
};

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 }) // newest first
      .populate("createdBy", "name email"); // optional: enrich with user info

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user tickets" });
  }
};

export const getTicketById = async (req, res) => {
  const { ticketId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(req.params.ticketId)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }
  try {
    const ticket = await Ticket.findById(ticketId).populate(
      "createdBy",
      "username email"
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    return res.status(500).json({ message: "Failed to fetch ticket" });
  }
};

export const getTicketsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const tickets = await Ticket.find({ createdBy: userId })
      .sort({ createdAt: -1 }) // newest first
      .populate("createdBy", "username email role"); // optional: enrich with user info

    if (!tickets.length) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user" });
    }

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets by user ID:", error);
    return res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { title, description, priority, status } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { title, description, priority, status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (ticket.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this ticket" });
    }

    // Partial updates
    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (priority !== undefined) ticket.priority = priority;
    if (status !== undefined) ticket.status = status;

    // Handle file replacement
    if (req.file) {
      // Delete old file from Cloudinary
      if (ticket.attachment?.public_id) {
        await cloudinary.uploader.destroy(ticket.attachment.public_id);
      }
      ticket.attachment = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    return res.status(201).json({
      message: "Ticket updated successfully",
      ticket: ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({ message: "Failed to update ticket" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 }) // newest first
      .populate("createdBy", "username email role") // enrich with user info
      .populate("assignedTo", "username email");

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong while fetching all tickets" });
  }
};

export const assignTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { agentId } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent") {
      return res
        .status(400)
        .json({ message: "Invalid agent ID or not an agent" });
    }

    ticket.assignedTo = agentId;
    await ticket.save();

    return res
      .status(200)
      .json({ message: "Ticket assigned successfully", ticket });
  } catch (error) {
    console.error("Error assigning ticket:", error);
    return res.status(500).json({ message: "Failed to assign ticket" });
  }
};

export const getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .sort({ createdAt: -1 }) // newest first
      .populate("createdBy", "username email role") // optional: enrich with user info
      .populate("assignedTo", "username email");

    if (!tickets.length) {
      return res.status(404).json({ message: "No assigned tickets found" });
    }
    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching assigned tickets:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch assigned tickets" });
  }
};

export const getTicketDashboard = async (req, res) => {
  try {
    const { status, priority, createdBy, assignedTo } = req.query;

    // dynamic filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (createdBy) filter.createdBy = createdBy;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email role")
      .populate("assignedTo", "username email role");
    return res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching dashboard tickets:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export const deleteTicket = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Only creator and admin can delete the ticket
    if (
      ticket.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this ticket" });
    }

    // Delete file from Cloudinary if exists
    if (ticket.attachment?.public_id) {
      await cloudinary.uploader.destroy(ticket.attachment.public_id);
    }

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketId);

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({ message: "Failed to delete ticket" });
  }
};

export const updateTicketStatus= async(req, res) => {
  const {ticketId} = req.params
  const {status} = req.body;
   const validStatuses = ['open', 'in-progress', 'closed'];

   try{
    if(!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket= await Ticket.findById(ticketId);
    if(!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const isAdmin=req.user.role === 'admin';
    const isAssignedAgent= req.user.id === ticket.assignedTo?.toString();

     if (!isAdmin && !isAssignedAgent) {
      return res.status(403).json({ message: "Not authorized to update ticket status" });
    }

    ticket.status = status;
    await ticket.save();

   } catch (error) {
     console.error("Error updating ticket status:", error);
     return res.status(500).json({ message: "Failed to update ticket status" });
   }
}