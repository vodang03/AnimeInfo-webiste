// models/favorite.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Đường dẫn tới Sequelize instance của bạn

const Favorite = sequelize.define(
  "Favorite",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    mal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "favorite",
    timestamps: false, // vì bạn chỉ cần lưu 2 ID
  }
);

module.exports = Favorite;
