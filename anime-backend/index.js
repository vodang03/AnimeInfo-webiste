require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http"); // ✅ Thêm dòng này
const { Server } = require("socket.io"); // ✅ Thêm dòng này
const cookieParser = require("cookie-parser");

const sequelize = require("./config/db");
const animeRoutes = require("./routes/anime.routes");
const authRoutes = require("./routes/auth.routes");
const discussionRoutes = require("./routes/discussion.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000"], // chính xác domain frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/anime", animeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/user", userRoutes);

// ✅ Tạo server HTTP từ Express
const server = http.createServer(app);

// // ✅ Khởi tạo socket server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true, // Nếu dùng auth socket
  },
});

// ✅ Xử lý sự kiện kết nối từ client
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`➡️ Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_message", (data) => {
    console.log("📨 Tin nhắn gửi:", data);
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Kết nối DB và khởi chạy server
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối DB thành công");

    server.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
      console.log(`📡 Socket.IO tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối DB:", err);
  });
