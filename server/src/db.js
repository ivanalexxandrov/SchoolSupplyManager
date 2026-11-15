const path = require('path');
const { Sequelize } = require('sequelize');

// SQLite файл, управляван през ORM (Sequelize). Не е нужен отделен DB сървър.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

module.exports = sequelize;
