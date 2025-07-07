import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Answer } from "../models/answer.model.js";

export const postAnswer = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Answer content is required");
  }

  const questionExists = await Question.findById(questionId);
  if (!questionExists) {
    throw new ApiError(404, "Question not found");
  }

  const answer = await Answer.create({
    question:questionId,
    answeredBy: req.user._id,
    text: content.trim(),
  });

  return res.status(201).json(
    new ApiResponse(201, answer, "Answer posted successfully")
  );
});
