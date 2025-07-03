
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

/*app.get("/", (req, res) => {
  res.send("CampusConnect backend running ✅");
});*/
import userRouter from './routes/user.routes.js';
app.use("/api/users",userRouter)
import messageRouter from './routes/message.routes.js';
app.use("/api/messages", messageRouter);

export { app };
