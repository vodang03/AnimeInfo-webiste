const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Trailer = sequelize.define(
  "Trailer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    anime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    youtube_video_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    thumbnail_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "anime_trailer",
    timestamps: false,
  }
);

module.exports = Trailer;
