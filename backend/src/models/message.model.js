import mongoose, { Schema } from "mongoose";

// Define the schema
const messageSchema = new Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    sender: {
      type: String, // store username directly
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    attachments: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video", "pdf", "raw"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite issue in dev
export default mongoose.models.Message || mongoose.model("Message", messageSchema);
