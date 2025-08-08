import express from "express";
import { getAdminDashboardStats, getTicketTrends } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  verifyToken,
  roleMiddleware(["admin", "superadmin"]),
  getAdminDashboardStats
);
router.get(
  "/dashboard/trends",
  verifyToken,
  roleMiddleware(["admin" , "superadmin"]),
  getTicketTrends
);

export default router;
