import User from "../models/User.js";
import mongoose from "mongoose";

export const canInitiateContact = async (req, res, next) => {
  console.log(" canInitiateContact hit");
  console.log("Sender:", req.user);
  console.log("Target:", req.params.userId)
  try {
    // Logged-in user (from JWT)
    const senderId = req.user.id;
    const senderRole = req.user.role;

    // Target user
    const targetUserId = req.params.userId;



  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ message: "Invalid target user ID" });
   }

    // 1️ Prevent self-contact
    if (senderId === targetUserId) {
      return res
        .status(400)
        .json({ message: "You cannot contact yourself" });
    }

    // 2️ Check target user exists
    const targetUser = await User.findById(targetUserId).select("role");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️ Prevent contacting admin
    if (targetUser.role === "admin") {
      return res
        .status(403)
        .json({ message: "You cannot contact admin" });
    }

    // 4️ Allow only valid platform roles
    const allowedRoles = ["member", "mentor", "master"];

    if (!allowedRoles.includes(senderRole)) {
      return res
        .status(403)
        .json({ message: "Your role cannot initiate contact" });
    }

    if (!allowedRoles.includes(targetUser.role)) {
      return res
        .status(403)
        .json({ message: "Target user cannot receive contact requests" });
    }

    //  All checks passed
    next();
  } catch (error) {
    console.error("canInitiateContact error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};