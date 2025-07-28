const express = require("express");
const router = express.Router();
const {
  getAllAnime,
  getSeasonalAnime,
  getAiringAnime,
  searchAnime,
  hintAnime,
  getAnimeById,
  getTrailers,
  addFavoriteAnime,
  getFavoritesByUserId,
  removeFavoriteAnime,
  getAllGenres,
  getAnimeByGenres,
  importAnime,
  updateAnimeById,
  getBestAnime,
  getFavoriteAnimeByUserId,
  searchAnimeByGenre,
  getBestAnimeAllTime,
  searchAnimeByTheme,
  ratingAnime,
} = require("../controllers/anime.controller");

router.get("/", getAllAnime);

// Những bộ anime hay nhiều người coi
router.get("/best", getBestAnime);
router.get("/bestalltime", getBestAnimeAllTime);

// Route lấy anime theo mùa
router.get("/seasonal", getSeasonalAnime);

// Route lấy anime đang lên sóng
router.get("/airing", getAiringAnime);

router.post("/ratings", ratingAnime);

// Gợi ý tìm kiếm
router.get("/hint", hintAnime);

// Anime tìm kiếm
router.get("/search", searchAnime);
router.get("/genresearch", searchAnimeByGenre);
router.get("/themesearch", searchAnimeByTheme);

// Thêm vào Favorite
router.post("/favorite", addFavoriteAnime);
router.delete("/favorite", removeFavoriteAnime);
router.get("/favorite/:id", getFavoritesByUserId);
router.get("/favoritelist/:userId", getFavoriteAnimeByUserId);

// Xoá Anime Favorite

// Lấy tất cả genre anime
router.get("/genre", getAllGenres);

// Lấy anime theo genres
router.get("/by-genres", getAnimeByGenres);

// Import anime vào db từ Jikan
router.get("/import-anime", importAnime);

// Các API có :id hoặc tương tự phải luôn để ở cuối file vì :id có thể nuốt mất những đường dẫn anime/xxxxxx
// Cập nhật lại thông tin anime
router.put("/:id", updateAnimeById);

// Lấy anime theo mal_id
router.get("/:id", getAnimeById);

// Lấy trailer theo mal_id của anime
router.get("/:id/trailer", getTrailers);

module.exports = router;
