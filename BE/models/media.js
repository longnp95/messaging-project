const Sequelize = require('sequelize');

const sequelize = require('../config/db');

// Create database with define model of Sequelize
const Media = sequelize.define('media', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  originalName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  // field cannot be null and type is String
  path: {
    type: Sequelize.STRING,
    allowNull: false
  },

  mimeType: {
    type: Sequelize.STRING,
    allowNull: false
  },

  size: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

module.exports = Media;