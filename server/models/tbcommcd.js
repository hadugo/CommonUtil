const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbcommcd', {
    TYPE: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      defaultValue: "",
      primaryKey: true,
      comment: "구분"
    },
    CODE: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      defaultValue: "",
      primaryKey: true,
      comment: "코드"
    },
    NAME: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "코드명"
    }
  }, {
    sequelize,
    tableName: 'tbcommcd',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TYPE" },
          { name: "CODE" },
        ]
      },
    ]
  });
};
