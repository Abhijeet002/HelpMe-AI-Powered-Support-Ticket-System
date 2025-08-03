import express from "express";
import { getMyProfile, updateMyProfile, getUserById } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js"; // Cloudinary Multer

const router = express.Router();

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, upload.single("avatar"), updateMyProfile);

// (Optional) Admin-only access to any user’s profile
router.get("/:id", verifyToken, roleMiddleware(["admin"]), getUserById);

// (Optional) Admin-only access to all users
// router.get("/", verifyToken, roleMiddleware(["admin"]), getAllUsers);
export default router;