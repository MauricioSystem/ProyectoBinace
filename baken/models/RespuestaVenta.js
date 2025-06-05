// models/RespuestaVenta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const RespuestaVenta = sequelize.define('RespuestaVenta', {
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagenComprobante: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'finalizado', 'cancelado'),
    defaultValue: 'pendiente',
  },
});

module.exports= RespuestaVenta;
