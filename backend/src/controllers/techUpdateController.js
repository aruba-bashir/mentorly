
import TechUpdate from "../models/TechUpdates.js";

//  CREATE
export const createUpdate = async (req, res) => {
  try {
    const { content } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
   // CLEAN
const cleanContent = content?.trim();

// REQUIRED
if (!cleanContent) {
  return res.status(400).json({
    message: "Content required",
  });
}

// START WITH LETTER
if (!/^[A-Za-z]/.test(cleanContent)) {
  return res.status(400).json({
    message:
      "Post must start with alphabet",
  });
}

// MIN LENGTH
if (cleanContent.length < 10) {
  return res.status(400).json({
    message: "Post too short",
  });
}

// MAX LENGTH
if (cleanContent.length > 500) {
  return res.status(400).json({
    message: "Post too long",
  });
}

// BAD WORD FILTER
const bannedWords = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "porn",
  "sex",
  "nude",
  "rape",
  "kill",
  "suicide",
];

const containsBadWord =
  bannedWords.some((word) =>
    cleanContent
      .toLowerCase()
      .includes(word)
  );

if (containsBadWord) {
  return res.status(400).json({
    message:
      "Inappropriate language not allowed",
  });
}
    const newUpdate = await TechUpdate.create({
      content: cleanContent,
      //image: req.file ? req.file.path : null,
      author: req.user._id,
      role: req.user.role,
    });

    //  populate before sending
    const populatedUpdate = await newUpdate.populate("author", "name role");

    res.status(201).json(populatedUpdate);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL
export const getUpdates = async (req, res) => {
  try {
    const updates = await TechUpdate.find()
      .populate("author", "name role_id")
      .sort({ createdAt: -1 });

    res.json(updates);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  UPDATE
export const updateUpdate = async (req, res) => {
  try {
    const update = await TechUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!update.author || update.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    update.content = req.body.content || update.content;

    //if (req.file) {
    //  update.image = req.file.path;
   // }

    const updated = await update.save();

    //  populate before sending
    const populatedUpdate = await updated.populate("author", "name role");

    res.json(populatedUpdate);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  DELETE

export const deleteUpdate = async (req, res) => {
  try {
    const update = await TechUpdate.findById(req.params.id);

    if (!update) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      update.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await update.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};