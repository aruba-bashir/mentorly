
import ContactRequest from "../models/ContactRequest.js";
import Connection from "../models/Connection.js";


//send contact request
 
export const sendContactRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    //  Check if request already exists (both directions)
    const existingRequest = await ContactRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res
          .status(400)
          .json({ message: "A contact request already exists" });
      }

      if (existingRequest.status === "accepted") {
        return res
          .status(400)
          .json({ message: "You are already connected" });
      }

      if (existingRequest.status === "rejected") {
        return res
          .status(400)
          .json({ message: "Request was previously rejected" });
      }
    }

    //  Create new request
    const request = await ContactRequest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({
      message: "Contact request sent",
      request,
    });
  } catch (error) {
    console.error("Send contact request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 // RESPOND TO CONTACT REQUEST
 
export const respondToContactRequest = async (req, res) => {
  try {
    const { status } = req.body; // accepted | rejected
    const requestId = req.params.requestId;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only receiver can respond
    if (request.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = status;

    if (status === "accepted") {
      const users = [
        request.sender.toString(),
        request.receiver.toString(),
      ].sort();

      await Connection.create({ users });
    }

    await request.save();

    res.json({
      message: `Request ${status}`,
      request,
    });
  } catch (error) {
    console.error("Respond request error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 // GET INCOMING REQUESTS

export const getIncomingRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({
      receiver: req.user.id,
      status: "pending",
    })
      .populate("sender", "name role email")
      .sort({ createdAt: -1 });

    res.json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Incoming requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


 // GET OUTGOING REQUESTS
 
export const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({
      sender: req.user.id,
    })
      .populate("receiver", "name role email")
      .sort({ createdAt: -1 });

    res.json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Outgoing requests error:", error);
    res.status(500).json({ message: "Server error" });
  }
};