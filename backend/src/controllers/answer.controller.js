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

  const answer = await Answer.findById(answerId).populate("answeredBy", "_id");
  if (!answer) {
    throw new ApiError(404, "Answer not found");
  }

  const author = await User.findById(answer.answeredBy._id);

  if (isUpvote) {
    if (answer.upvotes.includes(userId)) {
      answer.upvotes.pull(userId);
      author.reputation -= 1;
    } else {
      answer.upvotes.addToSet(userId);
      if (answer.downvotes.includes(userId)) author.reputation += 1;
      else author.reputation += 1;
      answer.downvotes.pull(userId);
    }
  } else {
    if (answer.downvotes.includes(userId)) {
      answer.downvotes.pull(userId);
      author.reputation += 1;
    } else {
      answer.downvotes.addToSet(userId);
      if (answer.upvotes.includes(userId)) author.reputation -= 1;
      else author.reputation -= 1;
      answer.upvotes.pull(userId);
    }
  }

  await answer.save();
  await author.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { upvotes: answer.upvotes.length, downvotes: answer.downvotes.length },
      "Vote updated"
    )
  );
});