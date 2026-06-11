
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { cleanupUnverifiedUsers }
from "./utils/cleanupUnverifiedUsers.js";
import userRoutes from "./routes/userRoutes.js";
import contactRequestRoutes from "./routes/contactRequestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"; //  now exists
import connectionRoutes from "./routes/connectionRoutes.js";
import webinarRoutes from "./routes/webinar.routes.js";
import jobRoutes from "./routes/jobRoutes.js";
import internshipRoutes from "./routes/internshipRoutes.js";
import techUpdateRoutes from "./routes/techUpdateRoutes.js";
import verifyRoute from "./routes/verifyRoute.js";
import qnaRoutes from "./routes/qnaRoutes.js";
import  adminUserRoutes from "./routes/adminUserRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());



app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ],
  credentials: true
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));
   await cleanupUnverifiedUsers();

app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", verifyRoute);
app.use("/api/contacts", contactRoutes); // this line NEEDS the file
app.use("/api/contact-requests", contactRequestRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/webinars", webinarRoutes);
app.use("/jobs", jobRoutes);
app.use("/internships", internshipRoutes);
app.use("/api/updates", techUpdateRoutes);
app.use("/api/qna", qnaRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/recommendations", recommendationRoutes);
//app.listen(5001, () => {
//console.log("Server running on port 5001");
//});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});