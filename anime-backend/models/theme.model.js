const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Theme = sequelize.define(
  "Theme",
  {
    theme_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "theme",
    timestamps: false,
  }
);

module.exports = Theme;
