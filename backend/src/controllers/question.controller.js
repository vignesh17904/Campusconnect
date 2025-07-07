import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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

  return res.status(201).json(
    new ApiResponse(201, question, "Question asked successfully")
  );
});
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

  return res.status(200).json(
    new ApiResponse(200, formatted, "Questions fetched")
  );
});
export const getQuestionById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId)
    .populate("askedBy", "username")
    .lean();

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  const answers = await Answer.find({ question:questionId })
    .populate("answeredBy", "username")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { question, answers }, "Question and answers fetched")
  );
});
