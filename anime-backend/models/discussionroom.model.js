const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DiscussionRoom = sequelize.define(
  "DiscussionRoom",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    create_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_member: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    now_member: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "discussion_rooms",
    timestamps: false, // Vì bạn đang dùng cột created_at tự define
  }
);

module.exports = DiscussionRoom;
