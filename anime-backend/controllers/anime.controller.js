const { Op } = require("sequelize");
const axios = require("axios");
const { literal } = require("sequelize");
const Anime = require("../models/anime.model");
const { Genre, Demographic, Theme } = require("../models");
const Trailer = require("../models/trailer.model");
const Favorite = require("../models/favorite.model");
const Licensor = require("../models/licensor.model");
const Producer = require("../models/producer.model");
const Studio = require("../models/studio.model");
const Rating = require("../models/rating.model");
const WatchStatus = require("../models/watchstatus.model");

// Hàm tạm dừng (delay)
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const sensitiveGenres = ["Hentai", "Ecchi", "Yaoi", "Yuri", "Josei"];

exports.getAllAnime = async (req, res) => {
  try {
    // Lấy page và limit từ query, mặc định nếu không có thì là 1 và 20
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Anime.findAndCountAll({
      distinct: true, //Vì gặp lỗi đếm nhiều lần cùng 1 bộ vì có các bảng nhiều nhiều
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Demographic,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Theme,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
      // order: [["score", "DESC"]],
      limit,
      offset,
    });

    // Trả về JSON
    res.json({
      data: rows,
      total: count, // Tổng số anime
    });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu anime." });
  }
};

exports.getBestAnime = async (req, res) => {
  try {
    // Lấy page và limit từ query, mặc định nếu không có thì là 1 và 20
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Anime.findAndCountAll({
      distinct: true, //Vì gặp lỗi đếm nhiều lần cùng 1 bộ vì có các bảng nhiều nhiều
      where: {
        year: {
          [Op.between]: [2022, 2025], // lọc năm trong khoảng 2020 - 2024
        },
      },
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Demographic,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Theme,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
      order: [
        [
          literal(
            `(popularity * 0.3 + favorites * 0.2 + scored_by * 0.2 + score * 0.2 + YEAR(aired_from) * 0.1)`
          ),
          "DESC",
        ],
      ],
      limit,
      offset,
    });

    const filteredRows = rows.filter((anime) => {
      const genreNames = anime.Genres.map((genre) => genre.name);
      return !genreNames.some((name) => sensitiveGenres.includes(name));
    });

    // Trả về JSON
    res.json({
      data: filteredRows,
      total: count, // Tổng số anime
    });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu anime." });
  }
};

exports.getBestAnimeAllTime = async (req, res) => {
  try {
    // Lấy page và limit từ query, mặc định nếu không có thì là 1 và 20
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Anime.findAndCountAll({
      distinct: true, //Vì gặp lỗi đếm nhiều lần cùng 1 bộ vì có các bảng nhiều nhiều
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Demographic,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Theme,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
      order: [[literal(`score`), "DESC"]],
      limit,
      offset,
    });

    // Lọc bỏ genre nhạy cảm hàm filter sẽ giữ lại những giá trị true
    const filteredRows = rows.filter((anime) => {
      const genreNames = anime.Genres.map((genre) => genre.name);
      return !genreNames.some((name) => sensitiveGenres.includes(name));
    });

    // Trả về JSON
    res.json({
      data: filteredRows,
      total: count, // Tổng số anime
    });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu anime." });
  }
};

exports.getSeasonalAnime = async (req, res) => {
  try {
    const { season, year } = req.query; // Lấy tham số season và year từ query

    if (!season || !year) {
      return res.status(400).json({ message: "Season và Year là bắt buộc!" });
    }

    // Tìm anime theo mùa và năm
    const seasonalAnime = await Anime.findAll({
      distinct: true, //Vì gặp lỗi đếm nhiều lần cùng 1 bộ vì có các bảng nhiều nhiều
      where: {
        season: season, // Mùa (winter, spring, summer, fall)
        year: year, // Năm
      },
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Demographic,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Theme,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
      order: [["score", "DESC"]],
    });

    // Trả kết quả
    res.json(seasonalAnime);
  } catch (err) {
    console.error("Lỗi khi lấy seasonal anime:", err);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu anime." });
  }
};

exports.getAiringAnime = async (req, res) => {
  try {
    // Lấy page và limit từ query, mặc định nếu không có thì là 1 và 20
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // console.log(limit, page);

    const { count, rows } = await Anime.findAndCountAll({
      distinct: true, //Vì gặp lỗi đếm nhiều lần cùng 1 bộ vì có các bảng nhiều nhiều
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Demographic,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Theme,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
      where: { airing: 1, type: { [Op.ne]: "Music" } },
      order: [["score", "DESC"]],
      limit,
      offset,
    });

    const filteredRows = rows.filter((anime) => {
      const genreNames = anime.Genres.map((genre) => genre.name);
      return !genreNames.some((name) => sensitiveGenres.includes(name));
    });

    // Trả về JSON
    res.json({
      data: filteredRows,
      total: count, // Tổng số anime
    });
  } catch (err) {
    console.error("Lỗi khi lấy airing anime:", err);
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu anime." });
  }
};

exports.hintAnime = async (req, res) => {
  try {
    const query = req.query.q || "";
    const result = await Anime.findAll({
      distinct: true, //Vì gặp lỗi đếm nhiều lần cùng 1 bộ vì có các bảng nhiều nhiều
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],

      where: {
        title: { [Op.like]: `%${query}%` },
      },

      // Logic tìm kiếm theo xu hướng hiện nay
      order: [
        [
          literal(
            `(popularity * 0.3 + favorites * 0.2 + scored_by * 0.2 + score * 0.2 + YEAR(aired_from) * 0.1)`
          ),
          "DESC",
        ],
      ],

      limit: 10, // chỉ lấy 10 kết quả gợi ý
      // attributes: ["title", "mal_id", "image_url"], // hoặc thêm ảnh, id gì đó nếu cần
    });

    const filteredRows = result.filter((anime) => {
      const genreNames = anime.Genres.map((genre) => genre.name);
      return !genreNames.some((name) => sensitiveGenres.includes(name));
    });

    res.json(filteredRows);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
    res.status(500).json({ message: "Lỗi khi tìm kiếm anime." });
  }
};

exports.searchAnime = async (req, res) => {
  try {
    const { q } = req.query;

    const result = await Anime.findAll({
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
      where: {
        title: { [Op.like]: `%${q}%` },
      },
      order: [
        [
          literal(
            `(popularity * 0.3 + favorites * 0.2 + scored_by * 0.2 + score * 0.2 + YEAR(aired_from) * 0.1)`
          ),
          "DESC",
        ],
      ],
      distinct: true, // để tránh trùng khi join nhiều bảng
    });

    const filteredRows = result.filter((anime) => {
      const genreNames = anime.Genres.map((genre) => genre.name);
      return !genreNames.some((name) => sensitiveGenres.includes(name));
    });

    res.json(filteredRows);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
    res.status(500).json({ message: "Lỗi khi tìm kiếm anime." });
  }
};

exports.searchAnimeByGenre = async (req, res) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({ message: "Thiếu tham số genre." });
    }

    const result = await Anime.findAll({
      include: [
        // Include 1: Filter anime theo genre
        {
          model: Genre,
          attributes: ["name"],
          where: {
            name: genre,
          },
          through: { attributes: [] },
          required: true, // bắt buộc phải có genre này mới lấy
        },
        {
          model: Demographic,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      order: [
        [
          literal(
            `(popularity * 0.3 + favorites * 0.2 + scored_by * 0.2 + score * 0.2 + YEAR(aired_from) * 0.1)`
          ),
          "DESC",
        ],
      ],
      distinct: true,
    });

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm theo genre:", err);
    res.status(500).json({ message: "Lỗi khi tìm kiếm anime theo genre." });
  }
};

exports.searchAnimeByTheme = async (req, res) => {
  try {
    const { theme } = req.query;

    if (!theme) {
      return res.status(400).json({ message: "Thiếu tham số genre." });
    }

    const result = await Anime.findAll({
      include: [
        // Include 1: Filter anime theo genre
        {
          model: Theme,
          attributes: ["name"],
          where: {
            name: theme,
          },
          through: { attributes: [] },
          required: true, // bắt buộc phải có genre này mới lấy
        },
        {
          model: Demographic,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      order: [
        [
          literal(
            `(popularity * 0.3 + favorites * 0.2 + scored_by * 0.2 + score * 0.2 + YEAR(aired_from) * 0.1)`
          ),
          "DESC",
        ],
      ],
      distinct: true,
    });

    res.json(result);
  } catch (err) {
    console.error("Lỗi khi tìm kiếm theo genre:", err);
    res.status(500).json({ message: "Lỗi khi tìm kiếm anime theo genre." });
  }
};

exports.getAnimeById = async (req, res) => {
  const animeId = req.params.id;
  // console.log(animeId);

  try {
    const result = await Anime.findOne({
      where: {
        mal_id: animeId,
      },
      include: [
        {
          model: Genre,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Demographic,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
        {
          model: Theme,
          attributes: ["name"], // lấy tên thể loại
          through: { attributes: [] }, // bỏ thông tin bảng trung gian
        },
      ],
    });
    // console.log("Anime found:", result);

    res.json(result);
  } catch (error) {
    console.error("Error fetching anime by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTrailers = async (req, res) => {
  const animeId = req.params.id;

  try {
    const result = await Trailer.findAll({
      where: {
        anime_id: animeId,
      },
    });

    // console.log("Trailer found:", result);

    res.json(result);
  } catch (error) {
    console.error("Error fetching trailer by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addFavoriteAnime = async (req, res) => {
  const { userId, anime_id } = req.body;

  if (!userId || !anime_id) {
    return res.status(400).json({ message: "Thiếu user_id hoặc anime_id" });
  }

  try {
    // Gọi create (mal_id là khóa chính bên anime)
    await Favorite.create({
      user_id: userId,
      mal_id: anime_id,
    });

    return res.status(200).json({ message: "Đã thêm vào danh sách yêu thích" });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Anime đã có trong danh sách yêu thích" });
    }

    console.error("❌ Lỗi khi thêm favorite:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getFavoritesByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Thiếu user_id" });
  }

  try {
    const favorites = await Favorite.findAll({
      where: { user_id: id },
      attributes: ["mal_id"], // chỉ trả về mal_id
    });

    res.status(200).json(favorites); // [{ mal_id: 123 }, { mal_id: 456 }]
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách yêu thích:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getFavoriteAnimeByUserId = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "Thiếu userId" });
  }

  try {
    // Lấy danh sách favorite theo userId, bao gồm thông tin anime (join bảng anime)
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Anime,
          as: "anime", // tên alias quan hệ nếu bạn có đặt
          attributes: [
            "mal_id",
            "title",
            "title_english",
            "title_japanese",
            "image_url",
            "score",
          ],
        },
      ],
    });

    // Nếu bạn không có alias, có thể dùng raw query hoặc join theo model của bạn

    // Trả về danh sách anime favorite, lấy dữ liệu anime trong mảng favorite
    const favoriteAnimeList = favorites.map((fav) => fav.anime);

    return res.status(200).json({ favorites: favoriteAnimeList });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách yêu thích:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getWatchStatusAnimeByUserId = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "Thiếu userId" });
  }

  try {
    // Lấy danh sách favorite theo userId, bao gồm thông tin anime (join bảng anime)
    const favorites = await WatchStatus.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Anime,
          attributes: ["mal_id", "title", "image_url"],
        },
      ],
    });

    return res.status(200).json({ favorites: favorites });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách kế hoạch xem:", err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.removeFavoriteAnime = async (req, res) => {
  const { userId, anime_id } = req.body;

  console.log(userId, anime_id);

  if (!userId || !anime_id) {
    return res.status(400).json({ message: "Thiếu user_id hoặc anime_id" });
  }

  try {
    await Favorite.destroy({ where: { user_id: userId, mal_id: anime_id } });
    res.status(200).json({ message: "Đã xoá khỏi danh sách yêu thích" });
  } catch (err) {
    console.error("Lỗi xoá favorite:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getAllGenres = async (req, res) => {
  try {
    const result = await Genre.findAll();

    res.status(200).json(result);
  } catch (err) {
    console.error("Lỗi lấy genre: ", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

exports.getAnimeByGenres = async (req, res) => {
  const { genres } = req.query; // genres = "7,10,24"
  if (!genres) return res.status(400).json({ message: "Thiếu genres" });

  const genreIds = genres.split(",").map(Number).filter(Boolean);
  if (genreIds.length === 0)
    return res.status(400).json({ message: "Genres không hợp lệ" });

  try {
    // Tìm anime mà có thể loại nằm trong genreIds
    const animeList = await Anime.findAll({
      where: {
        year: {
          [Op.between]: [2015, 2025], // lọc năm trong khoảng 2020 - 2024
        },
      },

      include: [
        {
          model: Genre,
          where: { genre_id: genreIds }, // điều kiện lọc genres
          attributes: ["genre_id", "name"],
          through: { attributes: [] },
          required: true, // bắt buộc phải có liên kết
        },
        {
          model: Demographic,
          attributes: ["name"],
          through: { attributes: [] },
        },
        {
          model: Theme,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],

      limit: 20,
      distinct: true,
      order: [["scored_by", "DESC"]],
    });

    res.json(animeList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST import anime từ API Jikan
exports.importAnime = async (req, res) => {
  try {
    const startPage = parseInt(req.query.startPage) || 1156;
    const endPage = parseInt(req.query.endPage) || 1157;

    const updatedAnimeTitles = [];

    for (let page = startPage; page <= endPage; page++) {
      const { data } = await axios.get(
        `https://api.jikan.moe/v4/anime?page=${page}`
      );

      for (const animeData of data.data) {
        // upsert trả về instance Sequelize phải dùng cách khác:
        // do upsert thường trả về [instance, created] hoặc chỉ số affectedRows tùy phiên bản
        // Nên dùng findOne + upsert hoặc findOrCreate cho an toàn

        // Tính toán year nếu bị null
        let computedYear = animeData.year;
        if (!computedYear && animeData.aired?.from) {
          try {
            computedYear = new Date(animeData.aired.from).getFullYear();
          } catch (_) {
            computedYear = null;
          }
        }

        // Tìm hoặc tạo Anime
        let [animeInstance, created] = await Anime.findOrCreate({
          where: { mal_id: animeData.mal_id },
          defaults: {
            title: animeData.title,
            title_english: animeData.title_english,
            title_japanese: animeData.title_japanese,
            title_vietnamese: null,
            type: animeData.type,
            source: animeData.source,
            episodes: animeData.episodes,
            status: animeData.status,
            airing: animeData.airing,
            duration: animeData.duration,
            score: animeData.score,
            scored_by: animeData.scored_by,
            rank: animeData.rank,
            popularity: animeData.popularity,
            members: animeData.members,
            favorites: animeData.favorites,
            synopsis: animeData.synopsis,
            background: animeData.background,
            image_url: animeData.images?.jpg?.large_image_url || null,
            trailer_url: animeData.trailer?.url || null,
            year: computedYear,
            season: animeData.season,
            rating: animeData.rating,
            aired_from: animeData.aired?.from
              ? new Date(animeData.aired.from)
              : null,
            aired_to: animeData.aired?.to ? new Date(animeData.aired.to) : null,
          },
        });

        if (!created) {
          // Nếu đã tồn tại, update trường mới
          await animeInstance.update({
            title: animeData.title,
            title_english: animeData.title_english,
            title_japanese: animeData.title_japanese,
            title_vietnamese: null,
            type: animeData.type,
            source: animeData.source,
            airing: animeData.airing,
            episodes: animeData.episodes,
            status: animeData.status,
            duration: animeData.duration,
            score: animeData.score,
            scored_by: animeData.scored_by,
            rank: animeData.rank,
            popularity: animeData.popularity,
            members: animeData.members,
            favorites: animeData.favorites,
            synopsis: animeData.synopsis,
            background: animeData.background,
            image_url: animeData.images?.jpg?.large_image_url || null,
            trailer_url: animeData.trailer?.url || null,
            year: computedYear,
            season: animeData.season,
            rating: animeData.rating,
            aired_from: animeData.aired?.from
              ? new Date(animeData.aired.from)
              : null,
            aired_to: animeData.aired?.to ? new Date(animeData.aired.to) : null,
          });
        }

        updatedAnimeTitles.push(animeData.title);

        // Xử lý genres
        if (animeData.genres?.length > 0) {
          // Lấy hoặc tạo genre instances
          const genreInstances = [];
          for (const genre of animeData.genres) {
            const [genreInstance] = await Genre.findOrCreate({
              where: { genre_id: genre.mal_id },
              defaults: { name: genre.name },
            });
            genreInstances.push(genreInstance);
          }

          // Liên kết anime với genres
          await animeInstance.setGenres(genreInstances);
          // Hoặc nếu muốn giữ liên kết cũ và thêm mới thì dùng addGenres()
        }

        // Xử lý demographics
        if (animeData.demographics?.length > 0) {
          const demographicInstances = [];
          for (const demographic of animeData.demographics) {
            const [demographicInstance] = await Demographic.findOrCreate({
              where: { demographic_id: demographic.mal_id },
              defaults: { name: demographic.name },
            });
            demographicInstances.push(demographicInstance); // sửa ở đây
          }

          await animeInstance.setDemographics(demographicInstances);
        }

        // Xử lý themes
        if (animeData.themes?.length > 0) {
          const themeInstances = [];
          for (const theme of animeData.themes) {
            const [themeInstance] = await Theme.findOrCreate({
              where: { theme_id: theme.mal_id },
              defaults: { name: theme.name },
            });
            themeInstances.push(themeInstance);
          }

          await animeInstance.setThemes(themeInstances);
        }

        // Xử lý licensors
        if (animeData.licensors?.length > 0) {
          const licensorInstances = [];

          for (const licensor of animeData.licensors) {
            const [licensorInstance] = await Licensor.findOrCreate({
              where: { licensor_id: licensor.mal_id },
              defaults: { name: licensor.name },
            });

            licensorInstances.push(licensorInstance);
          }

          await animeInstance.setLicensors(licensorInstances);
        }

        // Xử lý producers
        if (animeData.producers?.length > 0) {
          const producerInstances = [];

          for (const producer of animeData.producers) {
            const [producerInstance] = await Producer.findOrCreate({
              where: { producer_id: producer.mal_id },
              defaults: { name: producer.name },
            });

            producerInstances.push(producerInstance);
          }

          await animeInstance.setProducers(producerInstances);
        }

        console.log("Đã cập nhật thông tin cho: ", animeData.title);

        // Xử lý studios
        if (animeData.studios?.length > 0) {
          const studioInstances = [];

          for (const studio of animeData.studios) {
            const [studioInstance] = await Studio.findOrCreate({
              where: { studio_id: studio.mal_id },
              defaults: { name: studio.name },
            });

            studioInstances.push(studioInstance);
          }

          await animeInstance.setStudios(studioInstances);
        }
      }

      // Delay 2 giây trước khi qua trang tiếp theo
      if (page < endPage) {
        await sleep(2000);
      }
    }

    res.status(200).json({
      message: `Đã cập nhật ${updatedAnimeTitles.length} anime`,
      updatedTitles: updatedAnimeTitles,
    });
    console.log("Dã hoàn tất quá trình cập nhật");
  } catch (error) {
    console.error("❌ Lỗi import:", error);
    res.status(500).json({ message: "Lỗi import anime" });
  }
};

// controller/animeController.js
exports.updateAnimeById = async (req, res) => {
  const animeId = req.params.id;
  const { title_vietnamese, synopsis_vn } = req.body;

  if (!title_vietnamese && !synopsis_vn) {
    return res.status(400).json({ message: "Thiếu thông tin cần cập nhật." });
  }

  try {
    // Ví dụ với Sequelize
    const [updatedRows] = await Anime.update(
      {
        title_vietnamese,
        synopsis_vn,
      },
      { where: { mal_id: animeId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Không có thông tin cập nhật." });
    }

    res.status(200).json({ message: "Cập nhật thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.ratingAnime = async (req, res) => {
  const { user_id, animeId, score } = req.body;

  if (!user_id || !animeId || score == null) {
    return res.status(400).json({ message: "Thiếu thông tin." });
  }

  try {
    // Tạo mới hoặc cập nhật rating
    await Rating.upsert({
      user_id: user_id,
      anime_id: animeId,
      score: score,
    });

    // Tính lại điểm trung bình và số lượt chấm
    const result = await Rating.findAndCountAll({
      where: { anime_id: animeId },
      attributes: [
        [
          Rating.sequelize.fn("AVG", Rating.sequelize.col("score")),
          "avg_score",
        ],
      ],
      raw: true,
    });

    const animeres = await Anime.findOne({
      where: { mal_id: animeId },
      attributes: ["score", "scored_by"],
    });

    const avgScore = parseFloat(result.rows[0].avg_score).toFixed(2);
    const newScoredBy = result.count;
    const currentScoredBy = animeres.dataValues.scored_by;

    // Chỉ cập nhật khi có người mới chấm
    if (newScoredBy >= currentScoredBy) {
      await Anime.update(
        { score: avgScore, scored_by: newScoredBy },
        { where: { mal_id: animeId } }
      );
    }

    res.json({
      message: "Chấm điểm thành công",
      averageScore: avgScore,
      scoredBy: newScoredBy,
      updated: newScoredBy > currentScoredBy, // tiện theo dõi frontend
    });
  } catch (err) {
    console.error("Lỗi khi chấm điểm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateWatchStatus = async (req, res) => {
  const { user_id, animeId, newstatus } = req.body;

  if (!user_id || !animeId || !newstatus) {
    return res.status(400).json({ message: "Thiếu thông tin." });
  }

  try {
    // Tạo mới hoặc cập nhật trạng thái xem
    await WatchStatus.upsert({
      user_id: user_id,
      anime_id: animeId,
      status_type_id: newstatus,
      updated_at: new Date(),
    });

    res.status(200).json({
      message: "Cập nhật trạng thái xem thành công",
    });
  } catch (err) {
    console.error("Lỗi khi upsert trạng thái:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getWatchStatus = async (req, res) => {
  const { user_id, animeId } = req.query;

  if (!user_id || !animeId) {
    return res.status(400).json({ message: "Thiếu thông tin." });
  }

  try {
    // Tạo mới hoặc cập nhật trạng thái xem
    const result = await WatchStatus.findOne({
      where: { user_id: user_id, anime_id: animeId },
    });

    res.status(200).json({
      message: "Lấy trạng thái xem thành công",
      watchstatus: result,
    });
  } catch (err) {
    console.error("Lỗi khi lấy trạng thái:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getRatingAnime = async (req, res) => {
  const { user_id, animeId } = req.query;

  if (!user_id || !animeId) {
    return res.status(400).json({ message: "Thiếu thông tin." });
  }

  try {
    // Tính lại điểm trung bình và số lượt chấm
    const result = await Rating.findOne({
      where: { anime_id: animeId, user_id: user_id },
    });

    res.status(200).json({
      message: "Lấy điểm thành công",
      rating: result,
    });
  } catch (err) {
    console.error("Lỗi khi chấm điểm:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
