import { User } from "../models/user.model.js";
import { Group } from "../models/group.model.js";
import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

/**
 * Get all users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

/**
 * Delete a user and cleanup references
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Remove user from all groups
  await Group.updateMany({}, { $pull: { members: userId, pendingRequests: userId } });

  // Remove user's questions
  await Question.deleteMany({ askedBy: userId });

  // Remove user's answers
  await Answer.deleteMany({ answeredBy: userId });

  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

/**
 * Get all groups
 */
export const getAllGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find().populate("admin", "username");

  res.status(200).json(new ApiResponse(200, groups, "All groups fetched"));
});

/**
 * Delete a group and cleanup user references
 */
export const deleteGroup = asyncHandler(async (req, res) => {
  const groupId = req.params.id;

  const group = await Group.findByIdAndDelete(groupId);
  if (!group) throw new ApiError(404, "Group not found");

  // Remove group from users' group list
  await User.updateMany(
    { "groups._id": groupId },
    { $pull: { groups: { _id: groupId } } }
  );

  res.status(200).json(new ApiResponse(200, {}, "Group deleted successfully"));
});

/**
 * Get all questions
 */
export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find()
    .populate("askedBy", "username")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, questions, "All questions fetched"));
});

/**
 * Delete a question and adjust author reputation
 */
export const deleteQuestion = asyncHandler(async (req, res) => {
  const questionId = req.params.id;

  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, "Question not found");

  const author = await User.findById(question.askedBy);
  if (author) {
    // Remove rep gained from upvotes
    author.reputation -= question.upvotes.length;
    author.reputation += question.downvotes.length;
    await author.save();
  }

  await Question.findByIdAndDelete(questionId);
  await Answer.deleteMany({ question: questionId });

  res.status(200).json(new ApiResponse(200, {}, "Question deleted successfully"));
});

/**
 * Delete a single answer and adjust reputation
 */
export const deleteAnswer = asyncHandler(async (req, res) => {
  const answerId = req.params.id;

  const answer = await Answer.findById(answerId);
  if (!answer) throw new ApiError(404, "Answer not found");

  const user = await User.findById(answer.answeredBy);
  if (user) {
    user.reputation -= 1;
    await user.save();
  }

  await Answer.findByIdAndDelete(answerId);

  res.status(200).json(new ApiResponse(200, {}, "Answer deleted successfully"));
});
export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const users = await User.find({
    username: { $regex: query, $options: "i" }
  }).select("-password -refreshToken");

  res.status(200).json(new ApiResponse(200, users, "Matching users fetched"));
});
export const searchGroups = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const groups = await Group.find({
    name: { $regex: query, $options: "i" }
  }).populate("admin", "username");

  res.status(200).json(new ApiResponse(200, groups, "Matching groups fetched"));
});
export const searchQuestions = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const questions = await Question.find({
    title: { $regex: query, $options: "i" }
  })
    .populate("askedBy", "username")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, questions, "Matching questions fetched"));
});

