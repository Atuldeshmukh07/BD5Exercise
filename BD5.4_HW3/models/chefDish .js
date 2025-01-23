let { DataTypes, sequelize } = require("../lib/");
let { dish } = require("./dish.js");
let { chef } = require("./chef.js");

let chefDish = sequelize.define("chefDish", {
  chefId: {
    type: DataTypes.INTEGER,
    references: {
      model: chef,
      key: "id",
    },
  },
  dishId: {
    type: DataTypes.INTEGER,
    references: {
      model: dish,
      key: "id",
    },
  },
});

dish.belongsToMany(chef, { through: chefDish });
chef.belongsToMany(dish, { through: chefDish });

module.exports = { chefDish };
