const { Billetera, Transaccion, Moneda } = require('../models');

exports.crearBilletera = async (req, res) => {
  try {
    const { moneda } = req.body;  
    const usuarioId = req.user.id;

    const monedaExistente = await Moneda.findByPk(moneda);
    if (!monedaExistente) {
      return res.status(404).json({ error: 'Moneda no encontrada.' });
    }

    const existente = await Billetera.findOne({
      where: { usuarioId, monedaId: moneda }
    });
    if (existente) {
      return res.status(400).json({ error: 'Ya tienes una billetera en esta moneda.' });
    }

   
    const nueva = await Billetera.create({
      usuarioId,
      monedaId: moneda,
      saldo: 0 
    });

    const billeteraConMoneda = await Billetera.findByPk(nueva.id, {
      include: [{ model: Moneda, attributes: ['nombre', 'simbolo'] }]
    });

    res.status(201).json(billeteraConMoneda);
  } catch (err) {
    console.error(' Error al crear billetera:', err);
    res.status(500).json({ error: 'Error al crear la billetera por si algun dia pasa' });
  }
};


exports.obtenerBilleterasUsuario = async (req, res) => {
  try {
    const billeteras = await Billetera.findAll({
      where: { usuarioId: req.user.id },
      include: {
        model: Moneda, 
        attributes: ['nombre', 'simbolo']
      }
    });
    const billeterasFormateadas = billeteras.map(b => ({
      id: b.id,
      saldo: b.saldo,
      moneda: b.Moneda ? b.Moneda.nombre : 'Desconocida no se por ahi'
    }));

    res.json(billeterasFormateadas);
  } catch (err) {
    console.error('Error al obtener billeteras:', err);
    res.status(500).json({ error: 'Error al obtener billeteras.' });
  }
};


exports.obtenerTransacciones = async (req, res) => {
  try {
    const billeteraId = req.params.id;

    const transacciones = await Transaccion.findAll({
      where: { billeteraId },
      order: [['createdAt', 'DESC']],
    });

    res.json(transacciones);
  } catch (err) {
    console.error('Error al obtener transacciones:', err);
    res.status(500).json({ error: 'Error al obtener transacciones.' });
  }
};
