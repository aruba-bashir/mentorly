import express from "express";
import { getMyConnections } from "../controllers/connectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyConnections);

export default router;