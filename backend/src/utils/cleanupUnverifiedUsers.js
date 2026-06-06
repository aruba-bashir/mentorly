import User from "../models/User.js";

export const cleanupUnverifiedUsers = async () => {
  try {

    await User.deleteMany({
      isVerified: false,
      createdAt: {
        $lt: new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ),
      },
    });

    console.log(
      "Old unverified users cleaned"
    );

  } catch (error) {

    console.log(
      "Cleanup error:",
      error.message
    );
  }
};