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
export const voteAnswer = asyncHandler(async (req, res) => {
  const { answerId } = req.params;
  const { isUpvote } = req.body;
  const userId = req.user._id;

  const answer = await Answer.findById(answerId);
  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  if (isUpvote) {
    if (answer.upvotes.includes(userId)) {
      answer.upvotes.pull(userId); 
    } else {
      answer.upvotes.addToSet(userId);
      answer.downvotes.pull(userId);
    }
  } else {
    if (answer.downvotes.includes(userId)) {
      answer.downvotes.pull(userId); 
    } else {
      answer.downvotes.addToSet(userId);
      answer.upvotes.pull(userId);
    }
  }

  await answer.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { upvotes: answer.upvotes.length, downvotes: answer.downvotes.length },
      "Vote updated"
    )
  );
});
