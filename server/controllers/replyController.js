import { Ticket } from "../models/Ticket.js";
import { Reply } from "../models/Reply.js";

export const addReply = async (req, res) => {
  const { ticketId } = req.params;
  const { id: userId, role } = req.user;
  const { message } = req.body;
  console.log(req.body);
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
    }

    // Only allow creator, assigned agent, or admin to reply
    const isCreator = ticket.createdBy.toString() === userId;
    const assignedTo = ticket.assignedTo?.toString() === userId;
    const isAdmin = role === "admin";

    if (!isCreator && !assignedTo && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Unauthorized to reply to this ticket" });
    }

    const reply = new Reply({
      ticket: ticketId,
      user: userId,
      message,
      senderRole: role,
    });
    await reply.save();
    return res.status(201).json({ message: "Reply added successfully", reply });
  } catch (error) {
    console.error("Error adding reply:", error);
    return res.status(500).json({ message: "Failed to add reply" });
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
      return res
        .status(403)
        .json({
          message:
            "Access denied! Unauthorized to view replies for this ticket",
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

    try{
        const reply  = await Reply.findById(replyId);
        if (!reply) {   
            return res.status(404).json({ message: "Reply not found" });
        }
        // Only allow the user who created the reply or an admin to edit it
        if (reply.user.toString() !== userId && role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to edit this reply" });
        }
        reply.message = message;
        await reply.save();
        return res.status(200).json({ message: "Reply updated successfully", reply });
    } catch (error) {
        console.error("Error updating reply:", error);
        return res.status(500).json({ message: "Failed to update reply" });
    }
}

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
      return res.status(403).json({ message: "Unauthorized to delete this reply" });
    }
    await reply.deleteOne();
    return res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    return res.status(500).json({ message: "Failed to delete reply" });
    }

}
