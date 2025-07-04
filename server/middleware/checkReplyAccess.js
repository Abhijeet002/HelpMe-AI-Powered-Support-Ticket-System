// middleware/checkReplyAccess.js
import { Ticket } from '../models/Ticket.js';

export const checkReplyAccess = async (req, res, next) => {
  const { ticketId } = req.params;
  const { id: userId, role } = req.user;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const isCreator = ticket.createdBy.toString() === userId;
    const isAssignedAgent = ticket.assignedTo?.toString() === userId;
    const isAdmin = role === 'admin';

    if (!isCreator && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ message: "Unauthorized to reply to this ticket" });
    }

    // attach ticket object if needed later
    req.ticket = ticket;

    next();
  } catch (error) {
    console.error("Access check failed:", error);
    return res.status(500).json({ message: "Server error during access check" });
  }
};
