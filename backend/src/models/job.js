


import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    applyLink: {
  type: String,
  default: "",
},
   created_by: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
 source: {
      type: String,
      enum: ["internal", "external"],
      default: "internal",
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

export default mongoose.model("Job", jobSchema);