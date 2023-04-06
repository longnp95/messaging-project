const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Reaction = db.define('reaction', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  // field cannot be null and type is String
  emoji: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Reaction;