let { DataTypes, sequelize } = require("../lib/");

let author = sequelize.define("author", {
  name: DataTypes.TEXT,
  birthYear: DataTypes.INTEGER,
});

module.exports = { author };
