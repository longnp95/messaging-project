const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Chat = db.define('chat', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  // field cannot be null and type is String
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  
  // field cannot be null and type is String
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  
  type: {
    type: Sequelize.STRING(8)
  }
});

module.exports = Chat;