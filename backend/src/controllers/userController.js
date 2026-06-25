/*import User from "../models/User.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE


export const updateProfile = async (req, res) => {

  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });
    }
   if (req.body.removeProfilePic === "true") {

  user.profilePic = "";

  const updatedUser = await user.save();

  return res.json(updatedUser);
}
    // CLEAN
    const cleanName =
      req.body.name?.trim();

    const cleanBio =
      req.body.bio?.trim();

    // NAME
    if (!cleanName) {

      return res.status(400).json({
        message: "Name required",
      });
    }

    if (
      !/^[A-Za-z]/.test(cleanName)
    ) {

      return res.status(400).json({
        message:
          "Name must start with alphabet",
      });
    }

    if (cleanName.length < 3) {

      return res.status(400).json({
        message: "Name too short",
      });
    }

    // BIO
    if (cleanBio) {

      if (
        !/^[A-Za-z]/.test(cleanBio)
      ) {

        return res.status(400).json({
          message:
            "Bio must start with alphabet",
        });
      }

      if (cleanBio.length < 10) {

        return res.status(400).json({
          message: "Bio too short",
        });
      }

      if (cleanBio.length > 300) {

        return res.status(400).json({
          message: "Bio too long",
        });
      }
    }

    // SKILLS
   let parsedSkills = [];

if (req.body.skills) {

  try {

    parsedSkills = JSON.parse(req.body.skills);

    // must be array
    if (!Array.isArray(parsedSkills)) {
      return res.status(400).json({
        message: "Skills must be an array",
      });
    }

    const invalidSkill = parsedSkills.some(
      (skill) =>
        typeof skill !== "string" ||
        !/^[A-Za-z][A-Za-z0-9\s+#./&-]*$/.test(
          skill.trim()
        )
    );

    if (invalidSkill) {

      return res.status(400).json({
        message: "Invalid skill format",
      });
    }

    // trim all skills
    parsedSkills = parsedSkills.map((skill) =>
      skill.trim()
    );

  } catch {

    return res.status(400).json({
      message: "Invalid skills format",
    });
  }
}

    // IMAGE VALIDATION
    if (req.file) {

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (
        !allowedTypes.includes(
          req.file.mimetype
        )
      ) {

        return res.status(400).json({
          message:
            "Only JPG, PNG, WEBP allowed",
        });
      }

      if (
        req.file.size >
        5 * 1024 * 1024
      ) {

        return res.status(400).json({
          message:
            "Image must be below 5MB",
        });
      }

      user.profilePic = req.file.path;
    }

    

    user.name = cleanName;
    user.bio = cleanBio;
    user.skills = parsedSkills;

    const updatedUser =
      await user.save();

    res.json(updatedUser);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};  */


import User from "../models/User.js";

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // REMOVE PROFILE PIC
    if (req.body.removeProfilePic === "true") {
      user.profilePic = "";

      const updatedUser = await user.save();

      return res.json(updatedUser);
    }

    // CLEAN
    const cleanName = req.body.name?.trim();
    const cleanBio = req.body.bio?.trim();

    // NAME VALIDATION
    if (!cleanName) {
      return res.status(400).json({
        message: "Name required",
      });
    }

    if (!/^[A-Za-z]/.test(cleanName)) {
      return res.status(400).json({
        message: "Name must start with alphabet",
      });
    }

    if (cleanName.length < 3) {
      return res.status(400).json({
        message: "Name too short",
      });
    }

    // BIO VALIDATION
    if (cleanBio) {
      if (!/^[A-Za-z]/.test(cleanBio)) {
        return res.status(400).json({
          message: "Bio must start with alphabet",
        });
      }

      if (cleanBio.length < 10) {
        return res.status(400).json({
          message: "Bio too short",
        });
      }

      if (cleanBio.length > 300) {
        return res.status(400).json({
          message: "Bio too long",
        });
      }
    }

    // SKILLS
    let parsedSkills = [];

    if (req.body.skills) {
      try {
        parsedSkills = JSON.parse(req.body.skills);

        if (!Array.isArray(parsedSkills)) {
          return res.status(400).json({
            message: "Skills must be an array",
          });
        }

        const invalidSkill = parsedSkills.some(
          (skill) =>
            typeof skill !== "string" ||
            !/^[A-Za-z][A-Za-z0-9\s+#./&-]*$/.test(skill.trim())
        );

        if (invalidSkill) {
          return res.status(400).json({
            message: "Invalid skill format",
          });
        }

        parsedSkills = parsedSkills.map((skill) => skill.trim());
      } catch {
        return res.status(400).json({
          message: "Invalid skills format",
        });
      }
    }

    // IMAGE (UPDATED FOR CLOUDINARY)
    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Only JPG, PNG, WEBP allowed",
        });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          message: "Image must be below 5MB",
        });
      }

      //  IMPORTANT CHANGE (Cloudinary URL)
      user.profilePic = req.file.path;
    }

    user.name = cleanName;
    user.bio = cleanBio;
    user.skills = parsedSkills;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};