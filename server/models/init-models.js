var DataTypes = require("sequelize").DataTypes;
var _tbcommcd = require("./tbcommcd");

function initModels(sequelize) {
  var tbcommcd = _tbcommcd(sequelize, DataTypes);


  return {
    tbcommcd,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
