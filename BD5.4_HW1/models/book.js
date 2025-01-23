let { DataTypes, sequelize } = require("../lib/");

let book = sequelize.define("book", {
  title: DataTypes.TEXT,
  genre: DataTypes.TEXT,
  publicationYear: DataTypes.INTEGER,
});

module.exports = { book };
