const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
    projectId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "프로젝트일련번호"
    },
    projectImg: {
      type: DataTypes.STRING(400),
      allowNull: false,
      comment: "이미지(배너)"
    },
    projectType: {
      type: DataTypes.STRING(1),
      allowNull: false,
      comment: "0이면앱, 1이면웹"
    },
    projectTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "프로젝트제목"
    }
  }, {
    sequelize,
    tableName: 'project',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "projectId" },
        ]
      },
    ]
  });
};
