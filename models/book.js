// Defining the Book model, with the properties 'title', 'author', 'genre', 'year'
// If the title or author are not defined via the app forms, the model cannot be validated and appropriate messages are displayed on the page

'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
    }
  };
  Book.init({
    title: {
      type : DataTypes.STRING,
      allowNull:false,
      validate:{notEmpty:{msg:'Please provide a value for "title"'}},
    },
    author: {
      type : DataTypes.STRING,
      allowNull:false,
      validate:{notEmpty:{msg:'Please provide a value for "author"'}},
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};