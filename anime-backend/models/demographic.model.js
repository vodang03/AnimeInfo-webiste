const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Demographic = sequelize.define(
  "Demographic",
  {
    demographic_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "demographic",
    timestamps: false,
  }
);

module.exports = Demographic;
