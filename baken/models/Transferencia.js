// models/Transferencia.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Transferencia = sequelize.define('Transferencia', {
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monedaOrigen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  monedaDestino: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billeteraOrigenId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  billeteraDestinoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('completada', 'fallida'),
    defaultValue: 'completada',
  }
});

module.exports = Transferencia;
