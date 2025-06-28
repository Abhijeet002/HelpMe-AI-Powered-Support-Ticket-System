import { Ticket } from "../models/Ticket.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
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
      .populate('createdBy', 'name email'); // optional: enrich with user info

    return res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch user tickets' });
  }
};

export const getAllTickets= async(req,res)=>{
    try{
        const tickets = await Ticket.find({createdBy: req.user.id}).sort({ createdAt: -1 }) // newest first
        .populate('createdBy', 'username email role'); // optional: enrich with user info

        return res.status(200).json({ tickets });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong while fetching all tickets' });
    }
}

export const getTicketById = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findById(ticketId)
      .populate('createdBy', 'username email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json({ ticket });
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
    return res.status(500).json({ message: 'Failed to fetch ticket' });
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
      return res.status(404).json({ message: 'Ticket not found' });
    }

    return res.status(200).json({ message: 'Ticket updated successfully', ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return res.status(500).json({ message: 'Failed to update ticket' });
  }
};



