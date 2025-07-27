const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Genre = require("../models/genre.model");
const { Op } = require("sequelize");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.registerAcc = async (req, res) => {
  try {
    const { username, email, password, birthDate } = req.body;

    console.log(birthDate);
    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !birthDate) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }
    // Kiểm tra email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email hoặc tên người dùng đã tồn tại." });
    }
    // Mã hóa mật khẩu
    const password_hash = await bcrypt.hash(password, 10);
    // Tạo user mới
    const newUser = await User.create({
      username,
      email,
      password_hash,
      birthDate,
      role: "user", // mặc định user
    });
    return res
      .status(201)
      .json({ message: "Đăng ký thành công.", userId: newUser.user_id });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// ✅ Đăng nhập trả token bằng cookie
exports.loginAcc = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc tên đăng nhập không tồn tại." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác." });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Đăng nhập thành công.",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// ✅ Đăng xuất
exports.logoutAcc = (req, res) => {
  console.log("Được gọi tới");
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "Đăng xuất thành công." });
};

// ✅ Lấy người dùng hiện tại
exports.getCurrentUser = async (req, res) => {
  console.log("Được gọi tới");

  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Genre,
          through: { attributes: [] }, // không lấy dữ liệu trung gian user_genre
          attributes: ["genre_id", "name"], // chỉ lấy trường cần thiết
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
