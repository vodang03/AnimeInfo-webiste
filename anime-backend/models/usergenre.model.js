const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserGenre = sequelize.define(
  "UserGenre",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    genre_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: "user_genre",
    timestamps: false, // nếu muốn tự quản lý created_at, updated_at
  }
);

module.exports = UserGenre;
