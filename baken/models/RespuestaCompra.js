// models/RespuestaCompra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const RespuestaCompra = sequelize.define('RespuestaCompra', {
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptado', 'cancelado'),
    defaultValue: 'pendiente',
  },
  anuncioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendedorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = RespuestaCompra;
