const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DiscussionRoomMessage = sequelize.define(
  "DiscussionRoomMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "discussion_room_messages",
    timestamps: false,
  }
);

module.exports = DiscussionRoomMessage;
