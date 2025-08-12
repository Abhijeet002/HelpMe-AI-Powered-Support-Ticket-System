// routes/authRoutes.js
import passport from "passport";
import {
  login,
  register,
  logout,
  refreshToken,
  googleAuthCallback,
} from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/refresh", refreshToken);

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback — no session: passport will call verify and attach req.user
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`,
  }),
  googleAuthCallback
);

export default router;
