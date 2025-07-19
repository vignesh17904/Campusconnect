import mongoose from "mongoose";
import { User } from "../models/user.model.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
const createAdminIfNotExists = async () => {
  const adminExists = await User.findOne({ email: "admin@campus.com" });
  if (!adminExists) {
    await User.create({
      fullName: "Admin",
      username: "admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      isGoogleUser: false,
      emailVerified: true,
      branch :"EEE",
      year: "4",
      rollNumber: "123456",
      refreshtoken:User.generateRefreshToken("admin"),

    });
    console.log("Admin user created");
  } else {
    console.log("Admin already exists");
  }
};

export default connectDB;
export { createAdminIfNotExists };
