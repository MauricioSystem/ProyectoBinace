
const { Billetera, Transaccion, Moneda } = require('../models');

exports.crearBilletera = async (req, res) => {
  try {
    const { moneda } = req.body;  // moneda es el id
    const usuarioId = req.user.id;

    // Verificar que la moneda exista en la tabla Moneda
    const monedaExistente = await Moneda.findByPk(moneda);
    if (!monedaExistente) {
      return res.status(404).json({ error: 'Moneda no encontrada.' });
    }

    // Verificar que no exista ya la billetera con ese usuario y moneda
    const existente = await Billetera.findOne({
      where: { usuarioId, monedaId: moneda }
    });
    if (existente) {
      return res.status(400).json({ error: 'Ya tienes una billetera en esta moneda.' });
    }

    // Crear la billetera
    const nueva = await Billetera.create({
      usuarioId,
      monedaId: moneda,
      saldo: 0 // inicializamos en 0
    });

    // Incluir datos de la moneda para mostrar en el frontend
    const billeteraConMoneda = await Billetera.findByPk(nueva.id, {
      include: [{ model: Moneda, attributes: ['nombre', 'simbolo'] }]
    });

    res.status(201).json(billeteraConMoneda);
  } catch (err) {
    console.error(' Error al crear billetera:', err);
    res.status(500).json({ error: 'Error al crear la billetera.' });
  }
};


exports.obtenerBilleterasUsuario = async (req, res) => {
  try {
    const billeteras = await Billetera.findAll({
      where: { usuarioId: req.user.id },
      include: {
        model: Moneda, // Incluir la moneda relacionada
        attributes: ['nombre', 'simbolo']
      }
    });

    // Opcional: formatear para mostrar la moneda directamente
    const billeterasFormateadas = billeteras.map(b => ({
      id: b.id,
      saldo: b.saldo,
      moneda: b.Moneda ? b.Moneda.nombre : 'Desconocida'
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
