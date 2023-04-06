const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Conversation = db.define('conversation', {
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
  last_message: {
    type: Sequelize.STRING
  },

  max_member: {
    type: Sequelize.INTEGER
  }
});

module.exports = Conversation;