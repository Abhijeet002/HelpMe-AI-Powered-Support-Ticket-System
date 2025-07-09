import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import Reply from "../models/Reply.js";
import User from "../models/User.js";

export const getMyProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Failed to fetch user profile" });
    }
}