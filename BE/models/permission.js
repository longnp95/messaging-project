const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Permission = db.define('permission', {
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

module.exports = Permission;