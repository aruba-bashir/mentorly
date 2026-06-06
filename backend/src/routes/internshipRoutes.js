import express from "express";

import {
  createInternship,
  getAllInternships,
  applyInternship,
  deleteInternship
} from "../controllers/internshipController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, getAllInternships);

router.post("/", protect, createInternship);

router.post("/:id/apply", protect, applyInternship);

router.delete("/:id", protect, deleteInternship);


export default router;