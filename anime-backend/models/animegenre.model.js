const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AnimeGenre = sequelize.define(
  "anime_genre",
  {
    mal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    genre_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    timestamps: false, // Tắt createdAt và updatedAt
    tableName: "anime_genre",
  }
);

module.exports = AnimeGenre;
