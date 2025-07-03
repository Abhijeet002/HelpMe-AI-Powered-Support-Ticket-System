import express from "express";
import { addReply, deleteReply, editReply, getRepliesForTicket } from "../controllers/replyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/replies/:ticketId
router.post("/:ticketId", verifyToken, addReply);
router.get('/:ticketId', verifyToken, getRepliesForTicket);
// PATCH /api/replies/edit/:replyId
router.patch('/edit/:replyId', verifyToken, editReply);

// DELETE /api/replies/delete/:replyId
router.delete('/delete/:replyId', verifyToken, deleteReply);


export default router;
