let { DataTypes, sequelize } = require("../lib/");

let student = sequelize.define("student", {
  name: DataTypes.TEXT,
  age: DataTypes.INTEGER,
});

module.exports = { student };
