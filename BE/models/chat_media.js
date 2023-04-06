const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Chat_Media  = db.define('chat_media', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Chat_Media;