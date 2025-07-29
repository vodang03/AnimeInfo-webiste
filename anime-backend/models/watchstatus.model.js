const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const WatchStatusType = require("./watchstatustype.model");

const WatchStatus = sequelize.define(
  "WatchStatus",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    anime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: WatchStatusType,
        key: "id",
      },
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "watch_status",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "anime_id"],
      },
    ],
  }
);

module.exports = WatchStatus;
