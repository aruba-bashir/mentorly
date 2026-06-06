import Connection from "../models/Connection.js";

export const getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      users: req.user.id,
    }).populate("users", "name role email");

    // Remove self from each connection
    const network = connections.map((conn) =>
      conn.users.filter(
        (user) => user._id.toString() !== req.user.id
      )[0]
    );

    res.json({
      count: network.length,
      connections: network,
    });
  } catch (error) {
    console.error("Get connections error:", error);
    res.status(500).json({ message: "Server error" });
  }
};