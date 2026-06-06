import express from "express";
import { sendContactRequest, respondToContactRequest,getIncomingRequests,getOutgoingRequests, } from "../controllers/contactRequestController.js";
import {protect} from "../middleware/authMiddleware.js";
import { canInitiateContact } from "../middleware/contactMiddleware.js";

const router = express.Router();

router.post(
  "/send/:userId",
  protect,
  canInitiateContact,
  sendContactRequest
);

router.patch(
  "/respond/:requestId",
  protect,
  respondToContactRequest
);
router.get("/incoming", protect, getIncomingRequests);

router.get("/outgoing", protect, getOutgoingRequests);

export default router;