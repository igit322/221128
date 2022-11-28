const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    adminId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "pk"
    },
    adminNick: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "아이디"
    },
    adminPwd: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "패스워드"
    },
    salt: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'admin',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "adminId" },
        ]
      },
    ]
  });
};
