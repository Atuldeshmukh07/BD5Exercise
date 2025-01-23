let { DataTypes, sequelize } = require("../lib/");

let course = sequelize.define("course", {
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
});

module.exports = { course };
