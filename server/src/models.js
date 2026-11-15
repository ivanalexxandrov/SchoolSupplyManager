const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  // Съхранява се САМО bcrypt хеш, никога паролата в чист вид
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'teacher'), allowNull: false, defaultValue: 'teacher' },
});

const Request = sequelize.define('Request', {
  requestNumber: { type: DataTypes.STRING(20), unique: true },
  caption: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 100000 } },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  isOpened: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  adminComment: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
});

User.hasMany(Request, { foreignKey: 'userId' });
Request.belongsTo(User, { as: 'author', foreignKey: 'userId' });

module.exports = { sequelize, User, Request };
