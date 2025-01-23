let { DataTypes, sequelize } = require("../lib/");
let { user } = require("./user_model.js");
let { track } = require("./track_model.js");

let like = sequelize.define("like", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  trackId: {
    type: DataTypes.INTEGER,
    references: {
      model: track,
      key: "id",
    },
  },
});

user.belongsToMany(track, { through: like });
track.belongsToMany(user, { through: like });

module.exports = { like };
