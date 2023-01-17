const Sequelize = require('sequelize');

const sequelize = require('../config/db');

// Create database with define model of Sequelize
const Type = sequelize.define('type', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  // field cannot be null and type is String
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Type;