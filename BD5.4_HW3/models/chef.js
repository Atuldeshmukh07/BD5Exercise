let { DataTypes, sequelize } = require("../lib/");

let chef = sequelize.define("chef", {
  name: DataTypes.TEXT,
  birthYear: DataTypes.INTEGER,
});

module.exports = { chef };
