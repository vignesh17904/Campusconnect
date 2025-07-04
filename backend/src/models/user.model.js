import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: { type: String, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "/user-profile-icon-placeholder.jpg",
    },
    password: { type: String },
    refreshToken: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isGoogleUser: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },

    branch: {
      type: String,
      enum: ["CSE", "ECE", "EEE", "MECH"],
      required: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    groups: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
        name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isGoogleUser) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.statics.generateRefreshToken = function (username) {
  return jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};
export const User = mongoose.model("User", userSchema);
