const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('qna', {
    qnaId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "문의 일련번호"
    },
    qnaWriter: {
      type: DataTypes.STRING(30),
      allowNull: true,
      comment: "문의자 이름"
    },
    qnaTitle: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "문의 제목"
    },
    qnaContent: {
      type: DataTypes.STRING(3000),
      allowNull: true,
      comment: "문의 내용"
    },
    qnaDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "문의날짜"
    },
    qnaPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "문의자 휴대번호"
    },
    qnaEmail: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "문의자 이메일"
    }
  }, {
    sequelize,
    tableName: 'qna',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "qnaId" },
        ]
      },
    ]
  });
};
