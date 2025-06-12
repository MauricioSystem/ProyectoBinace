/*const { Billetera, Transaccion } = require('../models');

exports.crearTransaccion = async (req, res) => {
  try {
    const { billeteraId, tipo, monto, descripcion } = req.body;

    const billetera = await Billetera.findByPk(billeteraId);
    if (!billetera || billetera.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado o billetera no encontrada.' });
    }

    let nuevoSaldo = billetera.saldo;
    if (tipo === 'compra') nuevoSaldo += monto;
    else if (tipo === 'venta' || tipo === 'transferencia') nuevoSaldo -= monto;

    if (nuevoSaldo < 0) {
      return res.status(400).json({ error: 'Saldo insuficiente.' });
    }

    billetera.saldo = nuevoSaldo;
    await billetera.save();

    const transaccion = await Transaccion.create({
      billeteraId,
      tipo,
      monto,
      descripcion,
    });

    res.json(transaccion);
  } catch (err) {
    console.error('Error al crear transacción:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
*/