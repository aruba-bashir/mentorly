import mongoose from "mongoose";

const techUpdateSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
   // image: {
   //   type: String, // image URL or path
   // },
     author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["mentor", "master"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TechUpdate", techUpdateSchema);