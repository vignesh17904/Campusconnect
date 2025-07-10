import dotenv from "dotenv";
import connectDB, { createAdminIfNotExists } from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config({ path: "./.env" });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Socket.io Events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Join Group
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`📥 Socket ${socket.id} joined group ${groupId}`);
  });

  // Send Message (just broadcast; message already saved in controller)
  socket.on("sendMessage", (messageData) => {
    const groupId = messageData.group;
    socket.to(groupId).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start Server
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
      createAdminIfNotExists();
    });
  })
  .catch((error) => {
    console.error("❌ Mongo connection failed:", error);
  });

