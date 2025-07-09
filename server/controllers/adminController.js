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
export const getTicketTrends = async (req, res) => {
  try {
    // Prepare the last 7 days (including today)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    }).reverse(); // So dates are in order: Day 1 → Day 7

    const rawCounts = await Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 6)), // 7 days back including today
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    //  Merge with fixed 7-day range
    const trendData = last7Days.map((date) => {
      const match = rawCounts.find((entry) => entry._id === date);
      return {
        date,
        count: match ? match.count : 0,
      };
    });

    return res.status(200).json({
      success: true,
      days: trendData, // [{ date: "2025-07-01", count: 3 }, ...]
    });
  } catch (error) {
    console.error("Error fetching ticket trends:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch ticket trends" });
  }
};
