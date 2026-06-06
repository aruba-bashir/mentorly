
import express from "express";

import {
  createUpdate,
  getUpdates,
  updateUpdate,
  deleteUpdate,
} from "../controllers/techUpdateController.js";

import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET ALL
router.get("/", protect, getUpdates);

// CREATE
router.post(
  "/",
  protect,
  allowRoles("mentor", "master"),
  createUpdate
);

// UPDATE
router.put(
  "/:id",
  protect,
  updateUpdate
);

// DELETE
router.delete(
  "/:id",
  protect,
  deleteUpdate
);

export default router;