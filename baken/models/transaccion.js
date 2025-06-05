// models/transaccion.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const Billetera = require('./billetera.js');
const User = require('./user.js');

const Transaccion = sequelize.define('Transaccion', {
  tipo: {
    type: DataTypes.ENUM('compra', 'venta', 'transferencia'),
    allowNull: false,
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aceptada', 'cancelada'),
    defaultValue: 'pendiente',
  },
  moneda: {
    type: DataTypes.STRING,
    allowNull: true, // Opcional dependiendo de la lógica
  },
});

// Relaciones
Billetera.hasMany(Transaccion, { foreignKey: 'billeteraId' });
Transaccion.belongsTo(Billetera, { foreignKey: 'billeteraId' });

User.hasMany(Transaccion, { foreignKey: 'usuarioId' });
Transaccion.belongsTo(User, { foreignKey: 'usuarioId' });

module.exports = Transaccion;
