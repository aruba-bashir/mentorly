import Question from "../models/Questions.js";
import Answer from "../models/Answer.js";


 
// CREATE QUESTION
export const createQuestion = async (req, res) => {
  try {

    if (req.user.role !== "member") {
      return res.status(403).json({
        message: "Only members can ask questions",
      });
    }

    let { title, description } = req.body;

    // CLEAN
    title = title?.trim();
    description = description?.trim();

    // REQUIRED
    if (!title || !description) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // TITLE VALIDATION
    if (!/^[A-Za-z]/.test(title)) {
      return res.status(400).json({
        message: "Title must start with alphabet",
      });
    }

    if (title.length < 5) {
      return res.status(400).json({
        message: "Title too short",
      });
    }

    if (title.length > 120) {
      return res.status(400).json({
        message: "Title too long",
      });
    }

    // DESCRIPTION VALIDATION
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

    if (description.length > 1000) {
      return res.status(400).json({
        message: "Description too long",
      });
    }

    // BAD WORD FILTER
    const bannedWords = [
      "fuck",
      "shit",
      "bitch",
      "asshole",
      "porn",
      "sex",
      "rape",
      "suicide",
      "kill",
    ];

    const fullText =
      `${title} ${description}`.toLowerCase();

    const containsBadWord =
      bannedWords.some((word) =>
        fullText.includes(word)
      );

    if (containsBadWord) {
      return res.status(400).json({
        message:
          "Inappropriate language not allowed",
      });
    }

    const question = await Question.create({
      title,
      description,
      user: req.user._id,
    });

    res.json(question);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

//get all qsns 
export const getQuestions = async (req, res) => {
  try {
    
      const questions = await Question.find()
       .populate("user", "name role")
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//delete qsn (owner /admin)
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (
      question.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await question.deleteOne();

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//answer (mentor, master )
 
 
// CREATE ANSWER
export const createAnswer = async (req, res) => {

  try {

    const allowedRoles = ["mentor", "master"];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Only mentors/master can answer",
      });
    }

    let { text, questionId } = req.body;

    // CLEAN
    text = text?.trim();

    // REQUIRED
    if (!text) {
      return res.status(400).json({
        message: "Answer required",
      });
    }

    // START LETTER
    if (!/^[A-Za-z]/.test(text)) {
      return res.status(400).json({
        message:
          "Answer must start with alphabet",
      });
    }

    // LENGTH
    if (text.length < 5) {
      return res.status(400).json({
        message: "Answer too short",
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        message: "Answer too long",
      });
    }

    // BAD WORD FILTER
    const bannedWords = [
      "fuck",
      "shit",
      "bitch",
      "asshole",
      "porn",
      "sex",
      "rape",
      "suicide",
      "kill",
    ];

    const containsBadWord =
      bannedWords.some((word) =>
        text.toLowerCase().includes(word)
      );

    if (containsBadWord) {
      return res.status(400).json({
        message:
          "Inappropriate language not allowed",
      });
    }

    const answer = await Answer.create({
      text,
      question: questionId,
      user: req.user._id,
    });

    res.json(answer);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
//get ans for a qsn
export const getAnswers = async (req, res) => {
  try {
    const answers = await Answer.find({
      question: req.params.questionId,
    }).populate("user", "_id name  role");

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//getall ans
export const getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.find()
      .populate("user", "_id name role");

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//del ans admin/owner
export const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (
      answer.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await answer.deleteOne();

    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};