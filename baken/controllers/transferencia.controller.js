const { Billetera, Transferencia, Moneda } = require('../models');

const realizarTransferencia = async (req, res) => {
  try {
    const { billeteraOrigenId, billeteraDestinoId, monto } = req.body;


    if (!billeteraOrigenId || !billeteraDestinoId || !monto || monto <= 0)
      return res.status(400).json({ error: 'Datos inválidos' });

    const origen = await Billetera.findByPk(billeteraOrigenId, {
      include: { model: Moneda }
    });
    const destino = await Billetera.findByPk(billeteraDestinoId, {
      include: { model: Moneda }
    });

    if (!origen || !destino)
      return res.status(404).json({ error: 'Billetera no encontrada' });

    if (origen.saldo < monto)
      return res.status(400).json({ error: 'Fondos insuficientes' });


    if (!origen.Moneda || !origen.Moneda.tipoCambioUSD ||
        !destino.Moneda || !destino.Moneda.tipoCambioUSD)
      return res.status(400).json({ error: 'Conversión no posible: falta tipoCambioUSD' });

//convelcion
    const enUSD = monto * origen.Moneda.tipoCambioUSD;
    const montoConvertido = enUSD / destino.Moneda.tipoCambioUSD;

    origen.saldo -= monto;
    destino.saldo += montoConvertido;

    await origen.save();
    await destino.save();

  
    const transferencia = await Transferencia.create({
      monto,
      monedaOrigen: origen.Moneda.nombre,
      monedaDestino: destino.Moneda.nombre,
      billeteraOrigenId,
      billeteraDestinoId,
      estado: 'completada'
    });

    res.json({
      mensaje: 'Transferencia completada',
      saldoOrigen: origen.saldo,
      saldoDestino: destino.saldo,
      transferencia
    });
  } catch (error) {
    console.error('Error en la transferencia:', error);
    res.status(500).json({
      error: 'Error al realizar transferencia',
      detalle: error.message
    });
  }
};

module.exports = { realizarTransferencia };
