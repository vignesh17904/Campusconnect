import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js";
import { Group } from "../models/group.model.js";
import axios from "axios";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import path from "path";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
 const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).select("username email reputation branch year rollNumber ");
  if (!user) throw new ApiError(404, "User not found");

  const questions = await Question.find({ askedBy: userId }).select("title tags createdAt");
  const answers = await Answer.find({ answeredBy: userId }).select("text question createdAt");

  return res.status(200).json(
    new ApiResponse(200, { user, questions, answers }, "User profile fetched")
  );
});
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("username email reputation branch year rollNumber role ");
  if (!user) throw new ApiError(404, "User not found");

  const questions = await Question.find({ askedBy: userId }).select("title tags createdAt");
  const answers = await Answer.find({ answeredBy: userId }).select("text question createdAt");

  return res.status(200).json(
    new ApiResponse(200, { user, questions, answers }, "User profile fetched")
  );
});
const generateAccessandRefreshtokens = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(404, "User not found");
    }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
}
catch(error){
    throw new ApiError(500,"something went wrong in generation of accsess and refresh token")
}

}
const signUp = asyncHandler(async (req, res) => {
  const { email, username, password, role, branch, year, rollNumber } = req.body;

  if ([email, username, password, role, branch, year, rollNumber].some(f => !f || f.trim?.() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");
  const expiry = Date.now() + 1000 * 60 * 10; // 10 minutes

  const createdUser = await User.create({
    username,
    email,
    password,
    role,
    branch,
    year,
    rollNumber,
    verificationToken,
    verificationTokenExpiry: expiry,
  });

  const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;

  await sendEmail(
    email,
    "Verify your email - CampusConnect",
    `<p>Hello ${username},</p><p>Click below to verify your email:</p><a href="${verifyLink}">${verifyLink}</a>`
  );

  return res.status(201).json(new ApiResponse(201, {}, "Verification email sent"));
});
 const verifyEmail = asyncHandler(async (req, res) => {
  const { email, token } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  if (user.emailVerified) {
    return res.status(200).json(new ApiResponse(200, {}, "Email already verified"));
  }

  if (
    user.verificationToken !== token ||
    user.verificationTokenExpiry < Date.now()
  ) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

const groupName = `${user.branch}-${user.year}`;

const group = await Group.findOneAndUpdate(
  { name: groupName},
  {
    $setOnInsert: {
      name: groupName,
      branch: user.branch,
      year: user.year,
    },
    $addToSet: { members: user._id },
  },
  {
    new: true,
    upsert: true,
  }
);


 
 await User.findByIdAndUpdate(user._id, {
  $addToSet: { groups: { _id: group._id, name: group.name } }
});
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateAccessandRefreshtokens(user.username);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Email verified, group assigned and logged in"
      )
    );
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if ([username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Username and password are required");
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isGoogleUser) {
    throw new ApiError(400, "Use Google Sign-In for this account");
  }

  if (!user.emailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshtokens(user.username);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
     sameSite: "None"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login successful"
      )
    );
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

  const options = {
    httpOnly: true,
    secure: true,
     sameSite: "None"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(401, "Unauthorized access - No refresh token");
  }

  try {
    const decodedToken = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id); 
    if (!user) {
      throw new ApiError(401, "Invalid refresh token - user not found");
    }

    if (incomingToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or reused");
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      secure: true,
       sameSite: "None"
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
const getUser= asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    throw new ApiError(400, "Valid email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  // Generate new token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  user.verifyToken = hashedToken;
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

  const emailContent = `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
  `;

  await sendEmail(email, "Email Verification", emailContent);

  return res.status(200).json(new ApiResponse(200, {}, "Verification email resent"));
});
export {
    signUp,
    login,
    logoutUser,
    refreshAccessToken,
    getUser,
    generateAccessandRefreshtokens,
    verifyEmail,
    resendVerificationEmail,
    getUserProfile,
    getUserById
}
