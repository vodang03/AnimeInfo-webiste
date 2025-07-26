const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Producer = sequelize.define(
  "Producer",
  {
    producer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "producer",
    timestamps: false,
  }
);

module.exports = Producer;
