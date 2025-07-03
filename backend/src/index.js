import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/message.model.js";

dotenv.config({ path: "./.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
  });

  socket.on("sendMessage", async ({ groupId, message, sender }) => {
    try {
      const newMsg = await Message.create({
        group: groupId,
        sender,
        message,
      });

      socket.to(groupId).emit("receiveMessage", {
        message: newMsg.message,
        sender: newMsg.sender,
        time: newMsg.createdAt,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.log("Mongo connection failed", error);
  });
