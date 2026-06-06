import User from "../models/User.js";

// CREATE TEST USER
export const createTestUser = async (req, res) => {
  try {
    const user = await User.create({
      name: "Test Member",
      email: "member@test.com",
      password: "dummy123",
      role: "member",
    });

    res.status(201).json({
      message: "Test user created",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
