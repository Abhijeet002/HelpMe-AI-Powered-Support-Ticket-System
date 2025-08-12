// server\controllers\authController.js

import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role, can be changed later
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Email/username and password are required" });
  }

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { username: identifier.trim() },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
        user: { id: user._id, username: user.username, role: user.role },
      });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed due to server error" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

export const refreshToken = (req, res) => {
  const token= req.cookies.refreshToken
  if(!token){
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const accessToken= generateAccessToken({
      _id:decoded.id,
    })
    res.status(200).json({ accessToken });
  }
  catch(error){
    console.error("Refresh Token Error:", error);
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const googleAuthCallback = async (req, res) => {
  // passport will attach user to req.user
  try {
    const user = req.user; // user document from passport verify
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    // generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

  
    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend success page — frontend will call /auth/refresh to get access token & user
    return res.redirect(`${process.env.FRONTEND_URL}/auth/google/success`);
  } catch (err) {
    console.error("Google auth callback error:", err);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};
