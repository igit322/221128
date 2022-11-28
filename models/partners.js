const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('partners', {
    partnersId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "협력업체번호"
    },
    partnerImg: {
      type: DataTypes.STRING(400),
      allowNull: false,
      comment: "이미지(아이콘)"
    },
    partnersName: {
      type: DataTypes.STRING(30),
      allowNull: false,
      comment: "협력업체명"
    }
  }, {
    sequelize,
    tableName: 'partners',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "partnersId" },
        ]
      },
    ]
  });
};
