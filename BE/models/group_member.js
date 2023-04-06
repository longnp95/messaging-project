const Sequelize = require('sequelize');

const db = require('../config/db');

// Create database with define model of Sequelize
const Group_Member = db.define('group_member', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Group_Member;