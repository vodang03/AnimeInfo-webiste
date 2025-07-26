const express = require("express");
const {
  getUserByID,
  updateUserByID,
  getAllUser,
  updateUserGenres,
  getAllAvatars,
  getGenresByUserID,
  addComment,
  getComment,
  delAccount,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/all", getAllUser);

router.post("/genre", updateUserGenres);

router.get("/avatar", getAllAvatars);

router.post("/comment", addComment);
router.get("/comment", getComment);

router.get("/:id", getUserByID);
router.put("/:id", updateUserByID);
router.delete("/:id", delAccount);

router.get("/genre/:id", getGenresByUserID);

module.exports = router;
