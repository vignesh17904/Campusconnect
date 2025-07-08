import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ✅ Ask a new question
export const askQuestion = asyncHandler(async (req, res) => {
  const { title, body, tags } = req.body;

  if (!title || !body) {
    throw new ApiError(400, "Title and description are required");
  }

  const question = await Question.create({
    title,
    body,
    tags,
    askedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, question, "Question asked successfully"));
});

// ✅ Fetch all questions
export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find()
    .populate("askedBy", "username")
    .sort({ createdAt: -1 });

  const formatted = questions.map((q) => ({
    _id: q._id,
    title: q.title,
    tags: q.tags,
    upvotes: q.upvotes.length,
    downvotes: q.downvotes.length,
    askedBy: q.askedBy.username,
    createdAt: q.createdAt,
    answersCount: q.answers.length,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, formatted, "Questions fetched"));
});

// ✅ Fetch question by ID (with answers)
export const getQuestionById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId)
    .populate("askedBy", "username")
    .lean();

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const answers = await Answer.find({ question: questionId })
    .populate("answeredBy", "username")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { question, answers }, "Question and answers fetched")
    );
});

// ✅ Toggle upvote/downvote for a question
export const voteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { isUpvote } = req.body;
  const userId = req.user._id;

  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  if (isUpvote) {
    if (question.upvotes.includes(userId)) {
      // Toggle off upvote
      question.upvotes.pull(userId);
    } else {
      // Add upvote and remove downvote
      question.upvotes.addToSet(userId);
      question.downvotes.pull(userId);
    }
  } else {
    if (question.downvotes.includes(userId)) {
      // Toggle off downvote
      question.downvotes.pull(userId);
    } else {
      // Add downvote and remove upvote
      question.downvotes.addToSet(userId);
      question.upvotes.pull(userId);
    }
  }

  await question.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        upvotes: question.upvotes.length,
        downvotes: question.downvotes.length,
      },
      "Vote updated"
    )
  );
});
