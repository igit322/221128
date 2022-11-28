const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('file', {
    fileId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "파일번호"
    },
    fileRoute: {
      type: DataTypes.STRING(400),
      allowNull: false,
      comment: "파일경로"
    },
    fileOrgName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "파일원본명"
    },
    sdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "공통정보번호"
    }
  }, {
    sequelize,
    tableName: 'file',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "fileId" },
        ]
      },
    ]
  });
};
