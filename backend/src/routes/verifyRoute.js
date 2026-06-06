
import express from "express";
import User from "../models/User.js";
const router = express.Router();

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verifyToken: token });

    //  No user found
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    //  ADD THIS HERE 
    if (user.isVerified) {
      return res.json({
        message: "Email already verified",
      });
    }

    //  Normal verification
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    return res.json({
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});
export default router;