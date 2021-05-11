'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate (models) {
      Image.belongsTo(models.Superhero, {
        foreignKey: 'heroId',
      });
    }
  }
  Image.init(
    {
      path: {
        allowNull: false,
        type: DataTypes.TEXT,
        validate: {
          notNull: true,
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'Image',
      tableName: 'images',
      underscored: true,
    }
  );
  return Image;
};
