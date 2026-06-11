import Job from "../models/job.js";
import Internship from "../models/Internship.js";

export const importJobs = async (req, res) => {
  try {
    const jobs = req.body;

    if (!Array.isArray(jobs)) {
      return res.status(400).json({
        message: "Expected array of jobs",
      });
    }

    let imported = 0;

    for (const job of jobs) {
      const exists = await Job.findOne({
        title: job.title,
        company: job.company,
      });

      if (exists) continue;

      await Job.create({
        title: job.title,
        company: job.company,
        location: job.location || "Remote",
        salary: job.salary || "Not Disclosed",
        description: job.description || "No description available",
        source: "external",
        applicants: [],
        created_by: null,
      });

      imported++;
    }

    res.json({
      success: true,
      imported,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
export const importInternships = async (req, res) => {
  try {
    const internships = req.body;

    if (!Array.isArray(internships)) {
      return res.status(400).json({
        message: "Expected array",
      });
    }

    let imported = 0;

    for (const internship of internships) {
      const exists = await Internship.findOne({
        title: internship.title,
        company: internship.company,
      });

      if (exists) continue;

      await Internship.create({
        title: internship.title,
        company: internship.company,
        location: internship.location || "Remote",
        stipend: internship.stipend || "Not Disclosed",
        description:
          internship.description ||
          "No description available",
        source: "external",
        applicants: [],
        created_by: null,
      });

      imported++;
    }

    res.json({
      success: true,
      imported,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};