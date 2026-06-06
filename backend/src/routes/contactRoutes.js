import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { canInitiateContact } from "../middleware/contactMiddleware.js";
import { sendRequestController } from "../controllers/contactController.js";

const router = express.Router();

router.post(
  "/request/:userId",
  protect,
  canInitiateContact,
  sendRequestController
);

export default router;