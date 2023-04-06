const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Chat_Reaction  = db.define('chat_reaction', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Chat_Reaction;