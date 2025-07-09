import mongoose from "mongoose";
import { Ticket } from "../models/Ticket.js";
import { Reply } from "../models/Reply.js";

export const getAdminDashboardStatistics = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "open" });
    const closedTickets = await Ticket.countDocuments({ status: "closed" });
    const inProgressTickets = await Ticket.countDocuments({
      status: "in-progress",
    });

    const totalReplies = await Reply.countDocuments();
    const totalUsers = await mongoose.model("User").countDocuments();
    const totalAgents = await mongoose
      .model("User")
      .countDocuments({ role: "agent" });
    const totalUnassignedTickets = await Ticket.countDocuments({
      assignedTo: null,
    });
    const totalAssignedTickets = await Ticket.countDocuments({
      assignedTo: { $ne: null },
    });

    const ticketPercentages = {
      open: ((openTickets / totalTickets) * 100).toFixed(2),
      closed: ((closedTickets / totalTickets) * 100).toFixed(2),
      inProgress: ((inProgressTickets / totalTickets) * 100).toFixed(2),
    };

    console.log("Ticket Percentages:", ticketPercentages);

    const ticketsPerAgent = await Ticket.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $project: {
          agentEmail: { $arrayElemAt: ["$agent.email", 0] },
          count: 1,
        },
      },
    ]);

    console.log("Tickets per Agent:", ticketsPerAgent);
    console.log("Admin Dashboard Statistics:", {
      totalTickets,
      openTickets,
      closedTickets,
      inProgressTickets,
      totalReplies,
      totalUsers,
      totalAgents,
      totalUnassignedTickets,
      totalAssignedTickets,
    });

    return res.status(200).json({
      totalTickets,
      openTickets,
      inProgressTickets,
      closedTickets,
      ticketsPerAgent,
      dailyTicketCounts,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard statistics:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch dashboard statistics" });
  }
};

// Returns ticket count per day for the last 7 days (including today)

