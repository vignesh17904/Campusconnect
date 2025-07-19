import {asyncHandler} from "../utils/asyncHandler.js";
import { GeminiCommunityPostHelper } from "../utils/geminiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const writeCommunityPost = asyncHandler(async (req, res) => {
  const { userPrompt } = req.body;

  if (!userPrompt?.trim()) {
    throw new ApiError(400, "Prompt text is required");
  }

  const result = await GeminiCommunityPostHelper(userPrompt.trim());

  if (!result) {
    throw new ApiError(500, "Failed to generate response from AI");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "AI-generated post created"));
});
