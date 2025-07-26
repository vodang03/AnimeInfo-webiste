const express = require("express");
const {
  createRoom,
  getRooms,
  joinRoom,
  getRoomMembers,
  getMessagesByRoom,
  createMessage,
} = require("../controllers/discussion.controller");
const router = express.Router();

// Tạo phòng thảo luận
router.post("/createroom", createRoom);

// Lấy thông tin phòng
router.get("/getrooms", getRooms);

// Người mới tham gia phòng
router.post("/joinroom", joinRoom);

// Lấy id những người trong phòng
router.get("/members/:roomId", getRoomMembers);

// Lấy tin nhắn theo idroom
router.get("/messages/:roomId", getMessagesByRoom);

// Lưu tin nhắn mới
router.post("/postmessage/:roomId", createMessage);

module.exports = router;
