const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("❌ Không có token trong cookie");
    return res.status(401).json({ message: "Chưa đăng nhập." });
  }

  console.log("✅ Token từ cookie:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token hợp lệ:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token không hợp lệ:", err.message);
    return res.status(403).json({ message: "Token không hợp lệ." });
  }
};
