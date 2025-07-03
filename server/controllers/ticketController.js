import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
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
      createdBy: req.user.id,
    });
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

    return res
      .status(200)
      .json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({ message: "Failed to update ticket" });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 }) // newest first
      .populate("createdBy", "username email role"); // enrich with user info

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

  // Validate ticketId format
  if (!ticketId || ticketId.trim() === "") {  
    return res.status(400).json({ message: "Ticket ID is required" });
  }
  // Check if ticketId is a valid MongoDB ObjectId
  // This regex checks if the ticketId is a 24-character hexadecimal string
  if (!/^[0-9a-fA-F]{24}$/.test(ticketId)) {
    return res.status(400).json({ message: "Invalid Ticket ID format" });
  }

  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }

  try {
    const ticket = await Ticket.findByIdAndDelete(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({ message: "Failed to delete ticket" });
  }
}
