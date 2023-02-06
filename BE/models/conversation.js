const Sequelize = require('sequelize');

const sequelize = require('../config/db');

// Create database with define model of Sequelize
const Conversation = sequelize.define('conversation', {
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
  },

  // field with type is String
  avatar: {
    type: Sequelize.STRING
  },
  
  // field with type is String
  lastMessage: {
    type: Sequelize.STRING
  },

  maxUser: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Conversation;