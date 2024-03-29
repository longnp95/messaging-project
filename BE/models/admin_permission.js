const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Admin_Permission = db.define('admin_permission', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Admin_Permission;