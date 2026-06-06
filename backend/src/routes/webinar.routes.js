import express from "express";
import { createWebinar, getWebinars } from "../controllers/webinar.controller.js";
import {protect} from "../middleware/authMiddleware.js";
import Webinar from "../models/Webinar.js";

const router = express.Router();

// Anyone logged in can view
router.get("/", protect, getWebinars);

// Only mentor or master can create
router.post("/", protect, (req, res, next) => {
  if (req.user.role === "mentor" || req.user.role === "master") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
}, createWebinar);



router.delete("/:id", protect, async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    //  ADMIN OR CREATOR CAN DELETE
    if (
      webinar.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await webinar.deleteOne();

    res.json({ message: "Webinar deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});




router.put("/:id", protect, async (req, res) => {
  try {
    const webinar = await Webinar.findById(req.params.id);

    if (!webinar) {
      return res.status(404).json({ message: "Webinar not found" });
    }

    // creator can edit
    if (
      
      webinar.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
   //  Prevent editing past webinars
    if (new Date(webinar.date) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot edit past webinar" });
    }

    webinar.title = req.body.title || webinar.title;
    webinar.description = req.body.description || webinar.description;
    webinar.date = req.body.date || webinar.date;
    webinar.zoomLink = req.body.zoomLink || webinar.zoomLink;

    const updated = await webinar.save();

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
