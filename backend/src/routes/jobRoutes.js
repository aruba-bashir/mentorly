import express from "express";

import {
  createJob,
  getAllJobs,
  applyJob,
  deleteJob,
} from "../controllers/jobController.js";
import { importJobs } from "../controllers/importController.js";
import { importAuth } from "../middleware/importAuth.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, createJob);
router.post(
  "/import",
  importAuth,
  importJobs
);
router.get("/", protect, getAllJobs);
router.post("/:id/apply", protect, applyJob);
router.delete("/:id", protect, deleteJob);

export default router;