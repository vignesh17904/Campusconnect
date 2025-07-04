import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const createGroup = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  if (!name) throw new ApiError(400, "Group name is required");

  const existingGroup = await Group.findOne({ name });
  if (existingGroup) throw new ApiError(409, "Group name already exists");

  const group = await Group.create({
    name,
    admin: userId,
    createdBy: userId,
    members: [userId],
  });
  await User.findByIdAndUpdate(userId, {
    $addToSet: { groups: { _id: group._id, name: group.name } },
  });

  res.status(201).json(new ApiResponse(201, group, "Group created successfully"));
});
