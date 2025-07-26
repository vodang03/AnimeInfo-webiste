const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Genre = sequelize.define(
  "Genre",
  {
    genre_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "genre",
    timestamps: false,
  }
);

module.exports = Genre;
