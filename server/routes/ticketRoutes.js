import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getMyTickets,
  createTicket,
  getTicketsByUserId,
  assignTicket,
  getAssignedTickets,
  getTicketDashboard,
  updateTicket,
  getAllTickets,
  getTicketById,
  deleteTicket,
} from "../controllers/ticketController.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { Reply } from "../models/Reply.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();


// For getting my tickets, accessible to both user and admin
router.get("/my-tickets", verifyToken, getMyTickets);

// For creating a ticket, accessible to both user and admin, Users can create tickets,(optional enhancement:admins can also create tickets on behalf of users) 
router.post(
  "/create",
  verifyToken,
  upload.single("attachment"),
  roleMiddleware(["user"]),
  createTicket
);

// For updating a ticket, only creator can update, accessible to both user and admin, but only the creator can update
router.put(
  "/:ticketId",
  verifyToken,
  roleMiddleware(["user"]),
  upload.single("attachment"),
  updateTicket
);

// For agent
router.get(
  "/assigned",
  verifyToken,
  roleMiddleware(["agent"]),
  getAssignedTickets
);

// For agent to get dashboard data, accessible to agents only
router.get(
  "/dashboard",
  verifyToken,
  roleMiddleware(["agent"]),
  getTicketDashboard
);

//only admin to access this route
router.get("/all", verifyToken, roleMiddleware(["admin"]), getAllTickets);
router.get(
  "/user/:userId",
  verifyToken,
  roleMiddleware(["admin"]),
  getTicketsByUserId
);

// For assigning a ticket, only admin can assign
router.patch(
  "/assign/:ticketId",
  verifyToken,
  roleMiddleware(["admin"]),
  assignTicket
);

// For getting ticket by ID, This route is accessible to both user and admin
router.get("/:ticketId", verifyToken, getTicketById);

// For deleting a ticket, only creator or admin can delete
router.delete(
  "/:ticketId",
  verifyToken,
  roleMiddleware(["user"]),
  deleteTicket
);




export default router;
