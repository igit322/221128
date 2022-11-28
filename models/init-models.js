var DataTypes = require("sequelize").DataTypes;
var _admin = require("./admin");
var _file = require("./file");
var _partners = require("./partners");
var _project = require("./project");
var _qna = require("./qna");
var _shareData = require("./shareData");

function initModels(sequelize) {
  var admin = _admin(sequelize, DataTypes);
  var file = _file(sequelize, DataTypes);
  var partners = _partners(sequelize, DataTypes);
  var project = _project(sequelize, DataTypes);
  var qna = _qna(sequelize, DataTypes);
  var shareData = _shareData(sequelize, DataTypes);


  return {
    admin,
    file,
    partners,
    project,
    qna,
    shareData,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
