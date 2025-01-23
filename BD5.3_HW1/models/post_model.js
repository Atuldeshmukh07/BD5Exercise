const { DataTypes, sequelize } = require("../lib/");

const post = sequelize.define("post", {
  title: DataTypes.TEXT,
  content: DataTypes.TEXT,
  author: DataTypes.INTEGER,
});

module.exports = { post };
