const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Licensor = sequelize.define(
  "Licensor",
  {
    licensor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "licensor",
    timestamps: false,
  }
);

module.exports = Licensor;
