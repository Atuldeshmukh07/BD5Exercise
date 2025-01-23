const { DataTypes, sequelize } = require("../lib/");

const company = sequelize.define("company", {
  name: DataTypes.TEXT,
  industry: DataTypes.TEXT,
  foundedYear: DataTypes.INTEGER,
  headquarters: DataTypes.TEXT,
  revenue: DataTypes.INTEGER,
});

module.exports = { company };
