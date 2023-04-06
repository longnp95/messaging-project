const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const User = db.define('user', {
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
  avatar: {
    type: Sequelize.STRING
  },

  // field cannot be null and type is String
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  
  // field cannot be null and type is String
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  // field cannot be null and type is INTEGER
  gender: {
    type: Sequelize.INTEGER,
    allowNull: false
  },

  // field with type is String
  dob: {
    type: Sequelize.STRING
  },

  // field with type is String
  mobile: {
    type: Sequelize.INTEGER
  },

  // field with type is String
  email: {
    type: Sequelize.STRING
  },

  // field with type is String
  address: {
    type: Sequelize.STRING
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

module.exports = User;