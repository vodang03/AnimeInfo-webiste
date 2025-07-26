const express = require("express");
const router = express.Router();
const {
  registerAcc,
  loginAcc,
  logoutAcc,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Đăng ký tài khoản
router.post("/register", registerAcc);

// Đăng nhập tài khoản
router.post("/login", loginAcc);

// Đăng xuất
router.post("/logout", logoutAcc);

// Lấy thông tin người dùng đang đăng nhập
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
