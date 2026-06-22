
import Internship from "../models/Internship.js";

// CREATE INTERNSHIP
export const createInternship = async (req, res) => {
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
      stipend,
      description,
    } = req.body;

    // CLEAN
    title = title?.trim();
    company = company?.trim();
    location = location?.trim();
    stipend = stipend?.trim();
    description = description?.trim();

    // REQUIRED
    if (
      !title ||
      !company ||
      !location ||
      !stipend ||
      !description
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // TITLE
    if (!/^[A-Za-z]/.test(title)) {
      return res.status(400).json({
        message:
          "Title must start with alphabet",
      });
    }

    if (title.length < 3) {
      return res.status(400).json({
        message: "Title too short",
      });
    }
     // company
    if  (!company.match(/^[A-Za-z0-9&.\- ]+$/)) {
      return res.status(400).json({
        message:
          "Company name  must start with alphabet",
      });
    }

    if (company.length < 2) {
      return res.status(400).json({
        message: "Company name is too short",
      });
    }

    // LOCATION
    if (!/^[A-Za-z]/.test(location)) {
      return res.status(400).json({
        message:
          "Location must start with alphabet",
      });
    }

    // STIPEND
    const stipendRegex =
      /^(₹|Rs\.?|rs\.?|\$)?\s?\d+(,\d{3})*(\s)?(LPA|lpa|k|K|\/month|per month)?$/;

    if (!stipendRegex.test(stipend)) {
      return res.status(400).json({
        message:
          "Enter valid stipend format",
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
        message:
          "Description too short",
      });
    }

    // CREATE
    const internship =
      await Internship.create({
        title,
        company,
        location,
        stipend,
        description,
        created_by: req.user.id,
      });

    res.status(201).json(internship);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL INTERNSHIPS
export const getAllInternships = async (
  req,
  res
) => {
  try {

    const {
      search,
      company,
      location,
      stipend,
    } = req.query;

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

    if (stipend) {

  const escapedStipend =
    stipend.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  filter.stipend = {
    $regex: escapedStipend,
    $options: "i",
  };
}

    const internships =
      await Internship.find(filter)
        .populate(
          "created_by",
          "name role email"
        )
        .sort({ createdAt: -1 });

    res.json(internships);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
};

// APPLY INTERNSHIP
export const applyInternship = async (
  req,
  res
) => {
  try {

    if (req.user.role !== "member") {
      return res.status(403).json({
        message:
          "Only members can apply",
      });
    }

    const internship =
      await Internship.findById(
        req.params.id
      );

    if (!internship) {
      return res.status(404).json({
        message:
          "Internship not found",
      });
    }

    if (!internship.applicants) {
      internship.applicants = [];
    }

    const alreadyApplied =
      internship.applicants.some(
        (applicant) =>
          applicant.toString() ===
          req.user._id
      );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    internship.applicants.push(
      req.user._id
    );

    await internship.save();

    res.json({
      message:
        "Applied successfully",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE INTERNSHIP
export const deleteInternship = async (
  req,
  res
) => {
  try {

    const internship =
      await Internship.findById(
        req.params.id
      );

    if (!internship) {
      return res.status(404).json({
        message:
          "Internship not found",
      });
    }

    // CREATOR OR ADMIN
    if (
  req.user.role !== "admin" &&
  (
    !internship.created_by ||
    internship.created_by.toString() !==
      req.user._id.toString()
  )
) {
  return res.status(403).json({
    message: "Not authorized",
  });
}
    await internship.deleteOne();

    res.json({
      message:
        "Internship deleted",
    });

  } catch (error) {
    console.error(
    "DELETE INTERNSHIP ERROR:",
    error
  );

    res.status(500).json({
      error: error.message,
    });
  }
};