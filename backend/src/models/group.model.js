import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "EEE", "MECH"],
    },
    year: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
groupSchema.index({ branch: 1, year: 1 }, { unique: true });
export const Group = mongoose.model("Group", groupSchema);
