import express from "express";
import {
  getRecommendedJobs,
  getRecommendedInternships,
} from "../controllers/recommendationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/jobs", protect, getRecommendedJobs);
router.get("/internships", protect, getRecommendedInternships);

export default router;