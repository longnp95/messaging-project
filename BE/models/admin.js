const Sequelize = require('sequelize');

const sequelize = require('../config/db');

// Create database with define model of Sequelize
const Admin = sequelize.define('admin', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  // field cannot be null and type is String
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },

  // field cannot be null and type is String
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },

  // field cannot be null and type is String
  status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  // field with type is String
  token: {
    type: Sequelize.STRING
  }
});

module.exports = Admin;