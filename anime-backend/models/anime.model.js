const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Anime = sequelize.define(
  "Anime",
  {
    mal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_english: {
      type: DataTypes.STRING,
    },
    title_japanese: {
      type: DataTypes.STRING,
    },
    title_vietnamese: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    source: {
      type: DataTypes.STRING,
    },
    episodes: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
    airing: {
      type: DataTypes.BOOLEAN,
    },
    duration: {
      type: DataTypes.STRING,
    },
    score: {
      type: DataTypes.FLOAT,
    },
    scored_by: {
      type: DataTypes.INTEGER,
    },
    rank: {
      type: DataTypes.INTEGER,
    },
    popularity: {
      type: DataTypes.INTEGER,
    },
    members: {
      type: DataTypes.INTEGER,
    },
    favorites: {
      type: DataTypes.INTEGER,
    },
    synopsis: {
      type: DataTypes.TEXT,
    },
    background: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.TEXT, // hoặc STRING nếu không quá dài
    },
    trailer_url: {
      type: DataTypes.TEXT,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    season: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.STRING,
    },
    aired_from: {
      type: DataTypes.DATE,
    },
    aired_to: {
      type: DataTypes.DATE,
    },
    synopsis_vn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "anime",
    timestamps: false,
  }
);

module.exports = Anime;
