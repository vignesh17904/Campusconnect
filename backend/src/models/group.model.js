import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  branch: String,
  year: String,
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pendingRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);
