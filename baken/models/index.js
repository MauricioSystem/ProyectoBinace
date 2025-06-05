const sequelize = require('../database/db.js');

const User = require('./user.js');
const Billetera = require('./billetera.js');
const Moneda = require('./moneda.js');
const Transaccion = require('./transaccion.js');
const AnuncioCompra = require('./AnuncioCompra.js');
const RespuestaCompra = require('./RespuestaCompra.js');
const AnuncioVenta = require('./AnuncioVenta.js');
const RespuestaVenta = require('./RespuestaVenta.js');
const Transferencia = require('./Transferencia.js'); 

// Relaciones existentes
User.hasMany(Billetera, { foreignKey: 'usuarioId' });
Billetera.belongsTo(User, { foreignKey: 'usuarioId' });

Moneda.hasMany(Billetera, { foreignKey: 'monedaId' });
Billetera.belongsTo(Moneda, { foreignKey: 'monedaId' });

User.hasMany(Transaccion, { foreignKey: 'usuarioId' });
Transaccion.belongsTo(User, { foreignKey: 'usuarioId' });

Billetera.hasMany(Transaccion, { foreignKey: 'billeteraId' });
Transaccion.belongsTo(Billetera, { foreignKey: 'billeteraId' });

User.hasMany(AnuncioCompra, { foreignKey: 'usuarioId' });
AnuncioCompra.belongsTo(User, { foreignKey: 'usuarioId' });

Moneda.hasMany(AnuncioCompra, { foreignKey: 'monedaId' });
AnuncioCompra.belongsTo(Moneda, { foreignKey: 'monedaId' });

AnuncioCompra.hasOne(RespuestaCompra, { foreignKey: 'anuncioId' });
RespuestaCompra.belongsTo(AnuncioCompra, { foreignKey: 'anuncioId' });

User.hasMany(RespuestaCompra, { foreignKey: 'vendedorId' });
RespuestaCompra.belongsTo(User, { foreignKey: 'vendedorId' });

User.hasMany(AnuncioVenta, { foreignKey: 'usuarioId' });
AnuncioVenta.belongsTo(User, { foreignKey: 'usuarioId' });

Moneda.hasMany(AnuncioVenta, { foreignKey: 'monedaId' });
AnuncioVenta.belongsTo(Moneda, { foreignKey: 'monedaId' });

AnuncioVenta.hasOne(RespuestaVenta, { foreignKey: 'anuncioId' });
RespuestaVenta.belongsTo(AnuncioVenta, { foreignKey: 'anuncioId' });

User.hasMany(RespuestaVenta, { foreignKey: 'compradorId' });
RespuestaVenta.belongsTo(User, { foreignKey: 'compradorId' });


Billetera.hasMany(Transferencia, { foreignKey: 'billeteraOrigenId', as: 'TransferenciasEnviadas' });
Billetera.hasMany(Transferencia, { foreignKey: 'billeteraDestinoId', as: 'TransferenciasRecibidas' });

Transferencia.belongsTo(Billetera, { foreignKey: 'billeteraOrigenId', as: 'origen' });
Transferencia.belongsTo(Billetera, { foreignKey: 'billeteraDestinoId', as: 'destino' });

module.exports = {
  sequelize,
  User,
  Billetera,
  Moneda,
  Transaccion,
  AnuncioCompra,
  RespuestaCompra,
  AnuncioVenta,
  RespuestaVenta,
  Transferencia, 
};
