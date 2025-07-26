const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Studio = sequelize.define(
  "Studio",
  {
    studio_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "studio",
    timestamps: false,
  }
);

module.exports = Studio;
