
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

  role: {
    type: String,
    enum: ["member", "mentor", "master", "admin"],
    default: "member",
  },

  bio: {
  type: String,
  default: "",
},
skills: [
  {
    type: String,
  },
],
profilePic: {
  type: String,
  default: "",
},


isBlocked: {
  type: Boolean,
  default: false,
},
  resetPasswordToken: {
  type: String,
},
resetPasswordExpires: {
  type: Date,
},
isVerified: {
  type: Boolean,
  default: false,
},
verifyToken: String,
verifyTokenExpiry: Date,
  
});

//  HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


export default mongoose.model("User", userSchema);