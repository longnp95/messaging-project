const Sequelize = require('sequelize');

const DB_NAME = 'messaging';
const DB_USERNAME = 'root';
const DB_PASSWORD = '12345678';

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: 'mysql',
  host: 'localhost',
  logging: false
});

module.exports = db;