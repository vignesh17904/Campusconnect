import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

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
 export const getAllUserCreatedGroups = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const groups = await Group.find({
    admin: { $ne: null }, 
    members: { $ne: userId }, 
    "joinRequests.user": { $ne: userId }, 
  }).select("name admin");

  res.status(200).json(new ApiResponse(200, groups, "Available groups fetched"));
});
export const sendJoinRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.body;

  const group = await Group.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (group.pendingRequests.includes(userId)) {
    throw new ApiError(400, "You already requested to join this group");
  }

  group.pendingRequests.push(userId);
  await group.save();

  const admin = await User.findById(group.admin);
  if (admin) {
    admin.notifications.push({
      type: "group-join-request",
      message: `${req.user.username} requested to join ${group.name}`,
      fromUser: req.user._id,
      groupId: group._id,
    });
    await admin.save();
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Join request sent and admin notified")
  );
});

export const getMyNotifications = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("notifications.fromUser", "username").populate("notifications.groupId", "name");

  res.status(200).json(new ApiResponse(200, user.notifications, "Notifications fetched"));
});
export const markNotificationAsSeen = asyncHandler(async (req, res) => {
  const { notificationIndex } = req.body;

  const user = await User.findById(req.user._id);
  if (!user || !user.notifications[notificationIndex]) throw new ApiError(404, "Notification not found");

  user.notifications[notificationIndex].seen = true;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Notification marked as seen"));
});
export const handleJoinRequest = asyncHandler(async (req, res) => {
  const { groupId, userId, action } = req.body;
  const adminId = req.user._id;

  const group = await Group.findById(groupId);
  if (!group || String(group.admin) !== String(adminId)) {
    throw new ApiError(403, "Only group admins can manage requests");
  }

  // Remove the request from pendingRequests array
  group.pendingRequests = group.pendingRequests.filter(
    (id) => String(id) !== String(userId)
  );

  if (action === "accept") {
    group.members.push(userId);
    await group.save();

    // Add user to the group and remove the notification from admin
    await User.findByIdAndUpdate(userId, {
      $addToSet: { groups: { _id: group._id, name: group.name } }
    });

    await User.findByIdAndUpdate(adminId, {
      $pull: {
        notifications: {
          groupId,
          type: "group-join-request",
          fromUser: userId,
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User added to group"));
  } else if (action === "reject") {
    await group.save();

    // Remove the notification from admin's notifications
    await User.findByIdAndUpdate(adminId, {
      $pull: {
        notifications: {
          groupId,
          type: "group-join-request",
          fromUser: userId,
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Join request rejected"));
  } else {
    throw new ApiError(400, "Invalid action");
  }
});
