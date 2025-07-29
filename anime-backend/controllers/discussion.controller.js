const DiscussionRoom = require("../models/discussionroom.model");
const User = require("../models/user.model");
const DiscussionRoomMember = require("../models/discussionroommember.model"); // Import model
const DiscussionRoomMessage = require("../models/discussionroommessage.model");

exports.createRoom = async (req, res) => {
  const { userID, title, maxMember } = req.body;

  //   console.log(userID, title, maxMember);

  if (!title || !userID || !maxMember) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newRoom = await DiscussionRoom.create({
      create_user_id: userID,
      title: title,
      max_member: maxMember,
      now_member: 1,
    });

    // Lấy thêm thông tin username
    const roomWithUser = await DiscussionRoom.findOne({
      where: { id: newRoom.id },
      include: [{ model: User, attributes: ["username"] }],
    });

    res.status(201).json(roomWithUser);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Error creating discussion room" });
  }
};

// Lấy thông tin các phòng họp
exports.getRooms = async (req, res) => {
  try {
    const rooms = await DiscussionRoom.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    // console.log(rooms);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching discussion rooms" });
  }
};

exports.joinRoom = async (req, res) => {
  const { user_id, room_id } = req.body;

  if (!user_id || !room_id) {
    return res.status(400).json({ message: "Missing user_id or room_id" });
  }

  try {
    // Kiểm tra nếu đã tham gia
    const existing = await DiscussionRoomMember.findOne({
      where: {
        user_id,
        discussion_room_id: room_id,
      },
    });

    if (existing) {
      return res.status(200).json({ message: "User already joined this room" });
    }

    // Thêm vào bảng discussion_room_members
    await DiscussionRoomMember.create({
      user_id,
      discussion_room_id: room_id,
      is_moderator: false, // mặc định không phải moderator
    });

    // Cập nhật now_member trong bảng discussion_rooms
    await DiscussionRoom.increment("now_member", {
      where: { id: room_id },
    });

    res.status(200).json({ message: "Joined room successfully" });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Error joining discussion room" });
  }
};

exports.getRoomMembers = async (req, res) => {
  const { roomId } = req.params;

  try {
    const members = await DiscussionRoomMember.findAll({
      where: { discussion_room_id: roomId },
      include: [
        {
          model: User,
          attributes: ["user_id", "username"],
        },
      ],
    });

    res.json(members);
  } catch (error) {
    console.error("Error fetching room members:", error);
    res.status(500).json({ message: "Failed to fetch members." });
  }
};

// Tạo tin nhắn mới
exports.createMessage = async (req, res) => {
  const { room_id, user_id, message, file_url } = req.body;
  try {
    const newMsg = await DiscussionRoomMessage.create({
      room_id,
      user_id,
      message,
      file_url,
    });
    res.json(newMsg);
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

exports.getMessagesByRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const currentUserId = req.query.userId;

    if (!roomId || !currentUserId) {
      return res.status(400).json({ message: "Missing roomId or userId" });
    }

    const messages = await DiscussionRoomMessage.findAll({
      where: { room_id: roomId },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["avatar_url", "username"],
        },
      ],
    });

    const enhancedMessages = messages.map((msg) => ({
      id: msg.id,
      userId: msg.user_id,
      message: msg.message,
      username: msg.User.username,
      file: msg.file_url,
      avatarUrl: msg.User?.avatar_url,
      isSender: msg.user_id === Number(currentUserId),
    }));

    res.json(enhancedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
