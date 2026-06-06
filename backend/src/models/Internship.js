import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  stipend: { type: String, required: true },
  description: { type: String, required: true },

  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  applicants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
},
{ timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);