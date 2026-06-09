

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import validator from "validator";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
//signup

export const signup = async (req, res) => {
  try {
   

    let { name, email, password, role } = req.body;

    // Trim & normalize
    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Name validation
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!name) {
  return res.status(400).json({ message: "Name is required" });
  }

    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "Invalid name" });
    }

    // Email validation
    if (!email) {
  return res.status(400).json({ message: "Email is required" });
}
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Must be at least 8 characters, include a letter, number & special character",
      });
    }

    // Role validation
    const allowedRoles = ["member", "mentor", "master"];
    role = allowedRoles.includes(role) ? role : "member";

    // Check existing user
    /*const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    } */

   const existingUser = await User.findOne({ email });

if (existingUser) {

  // already verified
  if (existingUser.isVerified) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // generate new verification token
  const verifyToken =
    crypto.randomBytes(32).toString("hex");

  existingUser.verifyToken = verifyToken;

  existingUser.verifyTokenExpiry =
    new Date(Date.now() + 3600000);

  await existingUser.save();

  // resend verification mail
  
   const verifyLink =
   `https://mentorly-bice.vercel.app/verify-email/${verifyToken}`;

  await sendEmail(
    email,
    "Verify your Mentorly account",
    `Click to verify your account:\n${verifyLink}`
  );

  return res.status(200).json({
    message:
      "Account exists but not verified. Verification email resent.",
  });
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verifyToken,
      verifyTokenExpiry: new Date(Date.now() + 3600000),
    });

    // Send email
    //const verifyLink = `http://localhost:5173/verify-email/${verifyToken}`;
    const verifyLink =
   `https://mentorly-bice.vercel.app/verify-email/${verifyToken}`;

    await sendEmail(
      email,
      "Verify your Mentorly account",
      `Click to verify your account:\n${verifyLink}`
    );
    

    res.status(201).json({
      message: "Signup successful. Please verify your email.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//login

export const login = async (req, res) => {
  try {

    let { email, password } = req.body;

    // SANITIZE
    email = email?.trim().toLowerCase();
    password = password?.trim();

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // EMAIL FORMAT
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // FIND USER
    const user = await User.findOne({ email })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // VERIFY EMAIL
    if (!user.isVerified) {
      return res.status(400).json({
        message:
          "Please verify your email first",
      });
    }

    // PASSWORD CHECK
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token =
      generateToken(
        user._id,
        user.role
      );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    });
  }
};

//forgot password...

export const forgotPassword = async (req, res) => {
  try {
 
    const email =
  req.body.email?.trim().toLowerCase();

if (!email) {
  return res.status(400).json({
    message: "Email required",
  });
}

const emailRegex =
 /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user with this email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    //const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    const resetLink =
   `https://mentorly-bice.vercel.app/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Reset Password",
      `Click here to reset your password:\n${resetLink}`
    );

    res.json({ message: "Reset link sent to your email" });

  } catch (err) {
    console.error("FORGOT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};




//reset password
export const resetPassword = async (req, res) => {
  try {
    
const { token } = req.params;
  let { password } = req.body;

    // SANITIZE
  password = password?.trim();
if (!password) {
  return res.status(400).json({
    message: "Password required",
  });
}

const passwordRegex =
 /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message:
      "Password must be strong",
  });
}

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};