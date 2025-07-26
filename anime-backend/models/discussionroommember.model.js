const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DiscussionRoomMember = sequelize.define(
  "DiscussionRoomMember",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discussion_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_moderator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "discussion_room_members",
    timestamps: false,
  }
);

module.exports = DiscussionRoomMember;
