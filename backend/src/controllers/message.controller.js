import Message from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMessagesByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const messages = await Message.find({ group: groupId }).sort("createdAt");
  res.status(200).json({ success: true, messages });
});
