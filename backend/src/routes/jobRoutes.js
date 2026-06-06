import express from "express";

import {
  createJob,
  getAllJobs,
  applyJob,
  deleteJob,
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getAllJobs);
router.post("/:id/apply", protect, applyJob);
router.delete("/:id", protect, deleteJob);


export default router;