import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);