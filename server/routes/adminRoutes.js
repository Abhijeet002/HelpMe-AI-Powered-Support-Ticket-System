import express from "express";
import { getAdminDashboardStats, getTicketTrends } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  roleMiddleware(["admin"]),
  getAdminDashboardStats
);
router.get(
  "/dashboard/trends",
  verifyToken,
  roleMiddleware(["admin"]),
  getTicketTrends
);

export default router;
