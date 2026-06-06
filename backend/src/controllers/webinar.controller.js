

import Webinar from "../models/Webinar.js";

// BAD WORDS
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

// URL VALIDATION
const isValidUrl = (url) => {

  try {

    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "http:" ||
      parsedUrl.protocol === "https:"
    );

  } catch {

    return false;
  }
};

// ONLY ALLOW MEETING LINKS
const isAllowedMeetingLink = (url) => {

  return (
    url.includes("zoom.us") ||
    url.includes("meet.google.com") ||
    url.includes("teams.microsoft.com")
  );
};

// BAD WORD CHECK
const containsBadWords = (text) => {

  return bannedWords.some((word) =>
    text.toLowerCase().includes(word)
  );
};

// CREATE WEBINAR
export const createWebinar = async (req, res) => {

  try {

    let {
      title,
      description,
      date,
      zoomLink,
    } = req.body;

    // CLEAN
    title =
      title
        ?.trim()
        .replace(/\s+/g, " ");

    description =
      description
        ?.trim()
        .replace(/\s+/g, " ");

    zoomLink =
      zoomLink?.trim();

    // REQUIRED
    if (
      !title ||
      !description ||
      !date ||
      !zoomLink
    ) {

      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    // TITLE VALIDATION
    if (
      !/^[A-Za-z]/.test(title)
    ) {

      return res.status(400).json({
        message:
          "Title must start with alphabet",
      });
    }

    if (title.length < 3) {

      return res.status(400).json({
        message:
          "Title must be at least 3 characters",
      });
    }

    if (title.length > 100) {

      return res.status(400).json({
        message:
          "Title too long",
      });
    }

    // DESCRIPTION VALIDATION
    if (
      !/^[A-Za-z]/.test(
        description
      )
    ) {

      return res.status(400).json({
        message:
          "Description must start with alphabet",
      });
    }

    if (
      description.length < 10
    ) {

      return res.status(400).json({
        message:
          "Description too short",
      });
    }

    if (
      description.length > 1000
    ) {

      return res.status(400).json({
        message:
          "Description too long",
      });
    }

    // BAD WORD FILTER
    if (
      containsBadWords(
        `${title} ${description}`
      )
    ) {

      return res.status(400).json({
        message:
          "Inappropriate content not allowed",
      });
    }

    // DATE VALIDATION
    const webinarDate =
      new Date(date);

    if (
      isNaN(webinarDate)
    ) {

      return res.status(400).json({
        message:
          "Invalid date",
      });
    }

    if (
      webinarDate < new Date()
    ) {

      return res.status(400).json({
        message:
          "Date must be future date",
      });
    }

    // LINK VALIDATION
    if (
      !isValidUrl(zoomLink)
    ) {

      return res.status(400).json({
        message:
          "Invalid meeting link",
      });
    }

    if (
      !isAllowedMeetingLink(
        zoomLink
      )
    ) {

      return res.status(400).json({
        message:
          "Only Zoom, Google Meet or Teams links allowed",
      });
    }

    // CREATE
    const webinar =
      await Webinar.create({
        title,
        description,
        date: webinarDate,
        zoomLink,
        speaker:
          req.user.name,
        createdBy:
          req.user.id,
      });

    res
      .status(201)
      .json(webinar);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to create webinar",
    });
  }
};

// GET ALL WEBINARS
export const getWebinars =
  async (req, res) => {

    try {

      const webinars =
        await Webinar.find()
          .populate(
            "createdBy",
            "name role"
          )
          .sort({ date: 1 });

      res.json(webinars);

    } catch (error) {

      res.status(500).json({
        message:
          "Failed to fetch webinars",
      });
    }
  };

// DELETE WEBINAR
export const deleteWebinar =
  async (req, res) => {

    try {

      const webinar =
        await Webinar.findById(
          req.params.id
        );

      if (!webinar) {

        return res.status(404).json({
          message:
            "Webinar not found",
        });
      }

      // AUTH CHECK
      if (
        webinar.createdBy.toString() !==
          req.user.id.toString() &&
        req.user.role !==
          "admin"
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      await webinar.deleteOne();

      res.json({
        message:
          "Webinar deleted",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// UPDATE WEBINAR
export const updateWebinar =
  async (req, res) => {

    try {

      let {
        title,
        description,
        date,
        zoomLink,
      } = req.body;

      const webinar =
        await Webinar.findById(
          req.params.id
        );

      if (!webinar) {

        return res.status(404).json({
          message:
            "Webinar not found",
        });
      }

      // AUTH CHECK
      if (
        webinar.createdBy.toString() !==
          req.user.id.toString() &&
        req.user.role !==
          "admin"
      ) {

        return res.status(403).json({
          message:
            "Not authorized",
        });
      }

      // CLEAN
      title =
        title
          ?.trim()
          .replace(/\s+/g, " ");

      description =
        description
          ?.trim()
          .replace(/\s+/g, " ");

      zoomLink =
        zoomLink?.trim();

      // REQUIRED
      if (
        !title ||
        !description ||
        !date ||
        !zoomLink
      ) {

        return res.status(400).json({
          message:
            "All fields are required",
        });
      }

      // TITLE
      if (
        !/^[A-Za-z]/.test(
          title
        )
      ) {

        return res.status(400).json({
          message:
            "Title must start with alphabet",
        });
      }

      if (
        title.length < 3
      ) {

        return res.status(400).json({
          message:
            "Title too short",
        });
      }

      if (
        title.length > 100
      ) {

        return res.status(400).json({
          message:
            "Title too long",
        });
      }

      // DESCRIPTION
      if (
        !/^[A-Za-z]/.test(
          description
        )
      ) {

        return res.status(400).json({
          message:
            "Description must start with alphabet",
        });
      }

      if (
        description.length < 10
      ) {

        return res.status(400).json({
          message:
            "Description too short",
        });
      }

      if (
        description.length > 1000
      ) {

        return res.status(400).json({
          message:
            "Description too long",
        });
      }

      // BAD WORDS
      if (
        containsBadWords(
          `${title} ${description}`
        )
      ) {

        return res.status(400).json({
          message:
            "Inappropriate content not allowed",
        });
      }

      // DATE
      const webinarDate =
        new Date(date);

      if (
        isNaN(webinarDate)
      ) {

        return res.status(400).json({
          message:
            "Invalid date",
        });
      }

      if (
        webinarDate <
        new Date()
      ) {

        return res.status(400).json({
          message:
            "Date must be future date",
        });
      }

      // LINK
      if (
        !isValidUrl(
          zoomLink
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid meeting link",
        });
      }

      if (
        !isAllowedMeetingLink(
          zoomLink
        )
      ) {

        return res.status(400).json({
          message:
            "Only Zoom, Google Meet or Teams links allowed",
        });
      }

      // UPDATE
      webinar.title =
        title;

      webinar.description =
        description;

      webinar.date =
        webinarDate;

      webinar.zoomLink =
        zoomLink;

      await webinar.save();

      res.json(webinar);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Update failed",
      });
    }
  };