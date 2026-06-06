
import express from "express";
import authRoutes from "./routes/authRoute.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/test", (req, res) => {
  res.send("APP IS WORKING");
});

export default app;
