
import { asyncHandler } from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const sendMessageWithAttachment = asyncHandler(async (req, res) => {
  const { groupId, sender, message } = req.body;
  const attachments = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) {
        attachments.push({
          url: result.secure_url,
          type: result.resource_type, // "image", "video", etc.
        });
        if(!result){
          throw new ApiError(500, `upload file to cloudinary failed`);
        }
      }
    }
  }
console.log("Final attachments", attachments);
console.log("Type of attachments:", typeof attachments);
console.log("Type of first element:", typeof attachments[0]);
  const newMsg = await Message.create({
    group: groupId,
    sender,
    message,
    attachments, // now an array
  });
  if (!newMsg) {
    throw new ApiError(500, `save message to mongo `);
  }

  res
    .status(200)
    .json(new ApiResponse(200, newMsg, "Message sent with attachments"));
})
export const getMessagesByGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const messages = await Message.find({ group: groupId }).sort("createdAt");
  res.status(200).json({ success: true, messages });
});

