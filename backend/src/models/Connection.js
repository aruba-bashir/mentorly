import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate connections
connectionSchema.index({ users: 1 }, { unique: true });

export default mongoose.model("Connection", connectionSchema);