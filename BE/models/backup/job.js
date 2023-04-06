const Sequelize = require('sequelize');

const backupdb = require('../../config/backupdb');

// Create database with define model of Sequelize
const Job = backupdb.define('job', {
  // field primary key and type is INTEGER
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  lastedId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tableName: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Job;