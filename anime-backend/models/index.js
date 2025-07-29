const Anime = require("./anime.model");
const Comment = require("./comment.model");
const Demographic = require("./demographic.model");
const DiscussionRoom = require("./discussionroom.model");
const DiscussionRoomMember = require("./discussionroommember.model");
const Favorite = require("./favorite.model");
const Genre = require("./genre.model");
const Licensor = require("./licensor.model");
const Producer = require("./producer.model");
const Rating = require("./rating.model");
const Studio = require("./studio.model");
const Theme = require("./theme.model");
const User = require("./user.model");
const WatchStatus = require("./watchstatus.model");
const WatchStatusType = require("./watchstatustype.model");

// Thiết lập quan hệ n-n qua bảng anime_genre
Anime.belongsToMany(Genre, {
  through: "anime_genre",
  foreignKey: "mal_id",
  otherKey: "genre_id",
  timestamps: false, // thêm cái này để tắt timestamps
});

Genre.belongsToMany(Anime, {
  through: "anime_genre",
  foreignKey: "genre_id",
  otherKey: "mal_id",
  timestamps: false, // thêm cái này để tắt timestamps
});

// Thiết lập quan hệ n-n qua bảng anime_demographic
Anime.belongsToMany(Demographic, {
  through: "anime_demographic",
  foreignKey: "mal_id",
  otherKey: "demographic_id",
  timestamps: false, // thêm cái này để tắt timestamps
});

Demographic.belongsToMany(Anime, {
  through: "anime_demographic",
  foreignKey: "demographic_id",
  otherKey: "mal_id",
  timestamps: false, // thêm cái này để tắt timestamps
});

// Thiết lập quan hệ n-n qua bảng anime_theme
Anime.belongsToMany(Theme, {
  through: "anime_theme",
  foreignKey: "mal_id",
  otherKey: "theme_id",
  timestamps: false, // thêm cái này để tắt timestamps
});

Theme.belongsToMany(Anime, {
  through: "anime_theme",
  foreignKey: "theme_id",
  otherKey: "mal_id",
  timestamps: false, // thêm cái này để tắt timestamps
});

// Anime - Licensor
Anime.belongsToMany(Licensor, {
  through: "anime_licensor",
  foreignKey: "mal_id",
  otherKey: "licensor_id",
  timestamps: false,
});

Licensor.belongsToMany(Anime, {
  through: "anime_licensor",
  foreignKey: "licensor_id",
  otherKey: "mal_id",
  timestamps: false,
});

// Anime - Producer
Anime.belongsToMany(Producer, {
  through: "anime_producer",
  foreignKey: "mal_id",
  otherKey: "producer_id",
  timestamps: false,
});

Producer.belongsToMany(Anime, {
  through: "anime_producer",
  foreignKey: "producer_id",
  otherKey: "mal_id",
  timestamps: false,
});

// Anime - Studio
Anime.belongsToMany(Studio, {
  through: "anime_studio",
  foreignKey: "mal_id",
  otherKey: "studio_id",
  timestamps: false,
});

Studio.belongsToMany(Anime, {
  through: "anime_studio",
  foreignKey: "studio_id",
  otherKey: "mal_id",
  timestamps: false,
});

// Thiết lập quan hệ n-n qua bảng favorite
Anime.belongsToMany(User, {
  through: "favorite",
  foreignKey: "mal_id",
  otherKey: "user_id",
});

User.belongsToMany(Anime, {
  through: "favorite",
  foreignKey: "user_id",
  otherKey: "mal_id",
});

// Khai báo Favorite thuộc về Anime (foreignKey: mal_id)
Favorite.belongsTo(Anime, {
  foreignKey: "mal_id",
  targetKey: "mal_id",
  as: "anime", // đặt alias 'anime' để dùng khi include
});

// Còn Anime có thể có nhiều Favorite
Anime.hasMany(Favorite, {
  foreignKey: "mal_id",
  sourceKey: "mal_id",
});

// Thiết lập mối quan hệ n-n qua bảng user_genre
User.belongsToMany(Genre, {
  through: "user_genre",
  foreignKey: "user_id",
  otherKey: "genre_id",
});

Genre.belongsToMany(User, {
  through: "user_genre",
  foreignKey: "genre_id",
  otherKey: "user_id",
});

// Quan hệ giữa user và comment
Comment.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Comment, { foreignKey: "user_id" });

// Một người dùng có nhiều chấm điểm
User.hasMany(Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
Rating.belongsTo(User, { foreignKey: "user_id" });

// Một anime có nhiều người chấm
Anime.hasMany(Rating, { foreignKey: "anime_id", onDelete: "CASCADE" });
Rating.belongsTo(Anime, { foreignKey: "anime_id" });

// Thiết lập quan hệ cho watchstatus
WatchStatus.belongsTo(User, { foreignKey: "user_id" });
WatchStatus.belongsTo(Anime, { foreignKey: "anime_id" });
WatchStatus.belongsTo(WatchStatusType, { foreignKey: "status_type_id" });

User.hasMany(WatchStatus, { foreignKey: "user_id" });
Anime.hasMany(WatchStatus, { foreignKey: "anime_id" });
WatchStatusType.hasMany(WatchStatus, { foreignKey: "status_type_id" });

// ✅ Khai báo association
DiscussionRoom.belongsTo(User, { foreignKey: "create_user_id" });
User.hasMany(DiscussionRoom, { foreignKey: "create_user_id" });

DiscussionRoomMember.belongsTo(User, { foreignKey: "user_id" });
DiscussionRoomMember.belongsTo(DiscussionRoom, {
  foreignKey: "discussion_room_id",
});

module.exports = {
  Anime,
  Demographic,
  DiscussionRoom,
  DiscussionRoomMember,
  Genre,
  Theme,
  User,
};
