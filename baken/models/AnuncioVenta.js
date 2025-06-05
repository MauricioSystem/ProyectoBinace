// models/AnuncioVenta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const AnuncioVenta = sequelize.define('AnuncioVenta', {
  precioUnidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cantidadDisponible: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  imagenMetodoPago: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'finalizado', 'cancelado'),
    defaultValue: 'activo',
  },
});
module.exports = AnuncioVenta;

