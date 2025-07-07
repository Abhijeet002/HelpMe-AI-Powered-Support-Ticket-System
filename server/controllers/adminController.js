import mongoose from "mongoose";
import { Ticket } from "../models/Ticket.js";
import { Reply } from "../models/Reply.js";

export const getAdminDashboardStatistics = async (req, res) => {
    try{
        const totalTickets= await Ticket.countDocuments();
        const openTickets= await Ticket.countDocuments({status: "open"});
        const closedTickets= await Ticket.countDocuments({status: "closed"});
        const inProgressTickets= await Ticket.countDocuments({status: "in-progress"});

        return res.status(200).json({
            totalTickets,
            openTickets,
            closedTickets,
            inProgressTickets
        });
    } catch (error) {
        console.error("Error fetching admin dashboard statistics:", error);
        return res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
}