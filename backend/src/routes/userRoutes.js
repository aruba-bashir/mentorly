
import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.put("/update", protect, upload.single("profilePic"), updateProfile);
router.get("/me", protect, getProfile);

export default router;