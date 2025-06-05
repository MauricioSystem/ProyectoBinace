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
  tipoCambioUSD: { // tipo de cambio con respecto al USD, ej: 1 para USD, 0.04 para Bs, etc.
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1, // Por defecto USD = 1
  },
});

module.exports = Moneda;
