const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shareData', {
    sdId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "공통정보관리 일련번호"
    },
    sdTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "공통정보관리 제목"
    },
    sdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "공통정보관리 날짜"
    },
    sdContent: {
      type: DataTypes.STRING(3000),
      allowNull: true,
      comment: "공통정보관리 내용"
    }
  }, {
    sequelize,
    tableName: 'shareData',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sdId" },
        ]
      },
    ]
  });
};
