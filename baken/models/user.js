// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  esAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, 
  }
});

module.exports = User;
