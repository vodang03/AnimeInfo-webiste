const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { Op, where } = require("sequelize");
const UserGenre = require("../models/usergenre.model");
const Avatar = require("../models/avatar.model");
const Comment = require("../models/comment.model");
const Favorite = require("../models/favorite.model");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.getAllUser = async (req, res) => {
  const user_id = req.params.id;

  try {
    const result = await User.findAll();
    res.json(result);
  } catch (err) {
    console.error("Error fetching anime by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUserByID = async (req, res) => {
  const user_id = req.params.id;

  try {
    const result = await User.findOne({
      where: {
        user_id: user_id,
      },
    });
    res.json(result);
  } catch (err) {
    console.error("Error fetching anime by ID:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateUserByID = async (req, res) => {
  const user_id = req.params.id;
  const updates = req.body;

  console.log(updates);

  try {
    // Cập nhật thông tin
    const [updatedRows] = await User.update(updates, {
      where: { user_id },
    });

    // console.log(updatedRows);

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "User not found or nothing changed" });
    } else {
      return res.status(201).json({ message: "Cap nhat thanh cong" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateUserGenres = async (req, res) => {
  const { user_id, genres } = req.body;

  if (!user_id || !genres || !Array.isArray(genres)) {
    return res.status(400).json({ message: "Thiếu dữ liệu hợp lệ" });
  }

  try {
    // Tạo mảng data nhiều bản ghi
    const records = genres.map((genre_id) => ({
      user_id,
      genre_id,
    }));

    // Xoá bản ghi trước đó
    await UserGenre.destroy({
      where: {
        user_id,
      },
    });

    // Thêm nhiều bản ghi cùng lúc
    await UserGenre.bulkCreate(records);

    return res.status(200).json({ message: "Đã cập nhật thể loại yêu thích" });
  } catch (err) {
    console.error("❌ Lỗi khi thêm favorite:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// controllers/avatarController.js
exports.getAllAvatars = async (req, res) => {
  try {
    const avatars = await Avatar.findAll(); // Sequelize hoặc ORM bạn đang dùng
    res.status(200).json(avatars);
  } catch (err) {
    console.error("Error fetching avatars:", err);
    res.status(500).json({ message: "Failed to fetch avatars" });
  }
};

exports.getGenresByUserID = async (req, res) => {
  const user_id = req.params.id;

  try {
    const genres = await UserGenre.findAll({
      where: { user_id },
    }); // Sequelize hoặc ORM bạn đang dùng
    res.status(200).json(genres);
  } catch (err) {
    console.error("Error fetching genres:", err);
    res.status(500).json({ message: "Failed to fetch genres" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { anime_id, user_id, comment } = req.body;

    if (!anime_id || !user_id || !comment?.trim()) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    const newComment = await Comment.create({
      anime_id,
      user_id,
      content: comment.trim(),
    });

    res.status(201).json({
      message: "Bình luận đã được thêm.",
      comment: newComment,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.getComment = async (req, res) => {
  try {
    const { anime_id } = req.query;

    if (!anime_id) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào." });
    }

    const comments = await Comment.findAll({
      where: { anime_id },
      include: [
        {
          model: User,
          attributes: ["user_id", "username", "avatar_url"], // Tùy chọn thông tin cần hiển thị
        },
      ],
      order: [["created_at", "DESC"]], // Sắp xếp mới nhất lên đầu
    });

    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      comment: comments,
    });
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

exports.delAccount = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    // Xoá các bản ghi liên quan
    await Favorite.destroy({ where: { user_id: id } });

    const deletedCount = await User.destroy({
      where: { user_id: id },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    return res.status(200).json({ message: "Đã xóa người dùng thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    return res.status(500).json({ message: "Lỗi server khi xóa người dùng." });
  }
};

exports.toggleLockAccount = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm người dùng
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Đảo ngược trạng thái khoá/mở
    user.is_locked = !user.is_locked;

    await user.save();

    return res.status(200).json({
      message: user.is_locked
        ? "Tài khoản đã bị khoá."
        : "Tài khoản đã được mở.",
      is_locked: user.is_locked,
    });
  } catch (error) {
    console.error("Lỗi khi khoá/mở tài khoản:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật trạng thái tài khoản." });
  }
};
