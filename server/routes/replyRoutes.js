import express from "express";
import {
  createReply,
  deleteReply,
  editReply,
  getRepliesForTicket,
} from "../controllers/replyController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import { checkReplyAccess } from "../middleware/checkReplyAccess.js";

const router = express.Router();

// POST /api/replies/create/:ticketId
router.post('/:ticketId', verifyToken, upload.single('attachment'), createReply);

router.get("/:ticketId", verifyToken, getRepliesForTicket);
// PATCH /api/replies/edit/:replyId
router.patch("/edit/:replyId", verifyToken, editReply);

// DELETE /api/replies/delete/:replyId
router.delete("/delete/:replyId", verifyToken, deleteReply);

export default router;
