const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WatchStatusType = sequelize.define(
  "WatchStatusType",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "watch_status_type",
    timestamps: false,
  }
);

module.exports = WatchStatusType;
