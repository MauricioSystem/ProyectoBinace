// models/AnuncioCompra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');

const AnuncioCompra = sequelize.define('AnuncioCompra', {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moneda: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  precioUnitario: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: true,  // ruta de la imagen subida
  },
  estado: {
    type: DataTypes.ENUM('abierto', 'esperando_respuesta', 'finalizado', 'cancelado'),
    defaultValue: 'abierto',
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = AnuncioCompra;
