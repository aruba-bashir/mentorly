
/*import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import {protect} from "../middleware/authMiddleware.js";
//import upload from "../utils/multer.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//router.put("/update", protect, upload.single("profilePic"), updateProfile);
router.put("/profile-pic", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path; // Cloudinary URL

    // save in DB
    await User.findByIdAndUpdate(req.user.id, {
      profilePic: imageUrl,
    });

    res.json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});
router.get("/me", protect, getProfile);

export default router; */

import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.put(
  "/profile-pic",
  protect,
  upload.single("image"),
  updateProfile
);

router.get("/me", protect, getProfile);

export default router;