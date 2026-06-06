export const sendRequestController = (req, res) => {
  return res.status(200).json({
    message: "canInitiateContact passed successfully",
    sender: req.user,
    targetUserId: req.params.userId,
  });
};