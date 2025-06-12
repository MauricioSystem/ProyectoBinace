const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const Moneda = sequelize.define('Moneda', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  simbolo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tipoCambioUSD: { 
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1, 
  },
});

module.exports = Moneda;
