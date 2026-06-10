import Job from "../models/job.js";
import Internship from "../models/Internship.js";
import User from "../models/User.js";


// RECOMMENDED JOBS

export const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // fallback: no skills → latest jobs
    if (!user.skills || user.skills.length === 0) {
      const jobs = await Job.find()
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json(jobs);
    }

    // match skills
    const regexSkills = user.skills.map(
  (skill) =>
    new RegExp(
      skill.replace(/\./g, "\\.?"),
      "i"
    )
);

    const jobs = await Job.find({
      $or: [
        { title: { $in: regexSkills } },
        { description: { $in: regexSkills } },
      ],
    }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// RECOMMENDED INTERNSHIPS

export const getRecommendedInternships = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // fallback: no skills → latest internships
    if (!user.skills || user.skills.length === 0) {
      const internships = await Internship.find()
        .sort({ createdAt: -1 })
        .limit(10);

      return res.json(internships);
    }

   const regexSkills = user.skills.map(
  (skill) =>
    new RegExp(
      skill.replace(/\./g, "\\.?"),
      "i"
    )
);

    const internships = await Internship.find({
      $or: [
        { title: { $in: regexSkills } },
        { description: { $in: regexSkills } },
      ],
    }).sort({ createdAt: -1 });

    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};