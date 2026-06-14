


import Job from "../models/job.js";

// CREATE JOB
export const createJob = async (req, res) => {
  try {
    if (
      req.user.role !== "master" &&
      req.user.role !== "mentor"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    let {
      title,
      company,
      location,
      salary,
      description,
    } = req.body;

    // CLEAN
    title = title?.trim();
    company = company?.trim();
    location = location?.trim();
    salary = salary?.trim();
    description = description?.trim();

    const cleanSalary = salary;

    // REQUIRED
    if (
      !title ||
      !company ||
      !location ||
      !salary ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // TITLE
    if (!/^[A-Za-z]/.test(title)) {
      return res.status(400).json({
        message: "Title must start with alphabet",
      });
    }

    if (title.length < 3) {
      return res.status(400).json({
        message: "Title too short",
      });
    }
    //company 
     if (!company.match(/^[A-Za-z0-9&.\- ]+$/)) {
      return res.status(400).json({
        message: "Company name must start with alphabet",
      });
    }

    if (company.length < 2) {
      return res.status(400).json({
        message: " Company name too short",
      });
    }
    // LOCATION
    if (!/^[A-Za-z]/.test(location)) {
      return res.status(400).json({
        message: "Location must start with alphabet",
      });
    }

    // SALARY
   const salaryRegex =
  /^(₹|Rs\.?|rs\.?|\$)?\s?\d+(,\d{3})*(\s)?(LPA|lpa|k|K|\/month|per month)?$/;

if (!salary) {
  return res.status(400).json({
    message: "Salary/Stipend required",
  });
}

if (!salaryRegex.test(salary)) {
  return res.status(400).json({
    message: "Invalid salary format",
  });
}

    // DESCRIPTION
    if (!/^[A-Za-z]/.test(description)) {
      return res.status(400).json({
        message:
          "Description must start with alphabet",
      });
    }

    if (description.length < 15) {
      return res.status(400).json({
        message: "Description too short",
      });
    }

    // CREATE
    const job = await Job.create({
      title,
      company,
      location,
      salary,
      description,
      created_by: req.user._id,
      applicants: [],
    });

    res.status(201).json(job);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  try {
    const { search, company, location, salary } = req.query;

    let filter = {};

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }
    if (company) {
      filter.company = {
        $regex: company,
        $options: "i",
      };
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

   if (salary) {

  const escapedSalary =
    salary.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  filter.salary = {
    $regex: escapedSalary,
    $options: "i",
  };
}
    const jobs = await Job.find(filter)
      .populate("created_by", "name role email")
      .sort({ createdAt: -1 });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// APPLY JOB
export const applyJob = async (req, res) => {
  try {
    if (req.user.role !== "member") {
      return res.status(403).json({
        message: "Only members can apply",
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (!job.applicants) {
      job.applicants = [];
    }

    const alreadyApplied = job.applicants.some(
      (applicant) =>
        applicant.toString() === req.user._id
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    job.applicants.push(req.user._id);

    await job.save();

    res.json({
      message: "Applied successfully",
    });

  } 
  catch (error) {
    res.status(500).json({
      error: error.message,
    });
  } 
 
};


// DELETE JOB
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // CREATOR OR ADMIN
    if (
      job.created_by.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    res.json({
      message: "Job deleted",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}; 

