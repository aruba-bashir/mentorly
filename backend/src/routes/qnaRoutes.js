import express from "express";
import {
  createQuestion,
  getQuestions,
  deleteQuestion,
  createAnswer,
  getAnswers,
  getAllAnswers,
  deleteAnswer,
} from "../controllers/qnaController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// QUESTIONS
router.post("/questions", protect, createQuestion);
router.get("/questions", protect, getQuestions);
router.delete("/questions/:id", protect, deleteQuestion);

// ANSWERS
router.post("/answers", protect, createAnswer);
router.get("/answers/:questionId", protect, getAnswers);
router.get("/answers", protect, getAllAnswers);
router.delete("/answers/:id", protect, deleteAnswer);

export default router;