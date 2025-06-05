const { DataTypes } = require('sequelize');
const sequelize = require('../database/db.js');
const User = require('./user.js');
const Moneda = require('./moneda.js');  

const Billetera = sequelize.define('Billetera', {
  saldo: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

// Relaciones
User.hasMany(Billetera, { foreignKey: 'usuarioId' });
Billetera.belongsTo(User, { foreignKey: 'usuarioId' });

Moneda.hasMany(Billetera, { foreignKey: 'monedaId' });
Billetera.belongsTo(Moneda, { foreignKey: 'monedaId' });

module.exports = Billetera;
