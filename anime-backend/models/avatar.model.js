const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

const Avatar = sequelize.define(
  "Avatar",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      defaultValue: "nekos.best",
    },
  },
  {
    tableName: "avatar",
    timestamps: false,
  }
);

module.exports = Avatar;
