const { AnuncioVenta, RespuestaVenta, User, Billetera, Transaccion, Moneda } = require('../models');
const fs = require('fs');

// Crear anuncio de venta
const crearAnuncioVenta = async (req, res) => {
  try {
    const { descripcion, moneda, cantidadDisponible, precioUnidad } = req.body;
    const usuarioId = req.user.id;
    let imagenMetodoPago = null;

    if (req.file) {
      imagenMetodoPago = `/uploads/${req.file.filename}`;
    }

    const monedaEncontrada = await Moneda.findOne({ where: { nombre: moneda } });
    if (!monedaEncontrada) {
      return res.status(400).json({ error: 'La moneda no existe.' });
    }

    const anuncio = await AnuncioVenta.create({
      descripcion,
      monedaId: monedaEncontrada.id,
      cantidadDisponible,
      precioUnidad,
      imagenMetodoPago,
      usuarioId,
      estado: 'activo',
    });

    res.status(201).json(anuncio);
  } catch (error) {
    console.error('Error al crear anuncio de venta:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar anuncios de venta
const listarAnuncios = async (req, res) => {
  try {
    const { moneda } = req.query;
    let filtro = {};

    if (moneda) {
      const monedaEncontrada = await Moneda.findOne({ where: { nombre: moneda } });
      if (!monedaEncontrada) {
        return res.status(400).json({ error: 'La moneda no existe.' });
      }
      filtro.monedaId = monedaEncontrada.id;
    }

    const anuncios = await AnuncioVenta.findAll({
      where: filtro,
      include: [
        { model: User, attributes: ['username'] },
        { model: Moneda, attributes: ['nombre', 'simbolo'] },
      ],
    });

    res.json(anuncios);
  } catch (error) {
    console.error('Error al listar anuncios de venta:', error);
    res.status(500).json({ error: error.message });
  }
};

// Responder a un anuncio de venta
const responderAnuncio = async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const compradorId = req.user.id;

    const anuncio = await AnuncioVenta.findByPk(anuncioId);
    if (!anuncio || anuncio.estado !== 'activo') {
      return res.status(400).json({ error: 'Anuncio no válido o cerrado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Imagen de comprobante requerida' });
    }

    let respuesta = await RespuestaVenta.findOne({ where: { anuncioVentaId: anuncioId } });
    if (respuesta) {
      if (respuesta.imagenComprobante) fs.unlinkSync(`.${respuesta.imagenComprobante}`);
      respuesta.imagenComprobante = `/uploads/${req.file.filename}`;
      respuesta.estado = 'pendiente';
      respuesta.compradorId = compradorId;
      respuesta.cantidad = anuncio.cantidadDisponible; // ¡Aseguramos que nunca esté null!
      await respuesta.save();
    } else {
      respuesta = await RespuestaVenta.create({
        anuncioVentaId: anuncioId,
        compradorId,
        imagenComprobante: `/uploads/${req.file.filename}`,
        estado: 'pendiente',
        cantidad: anuncio.cantidadDisponible, // 👈 ¡campo importante!
      });
    }

    anuncio.estado = 'esperando_pago';
    await anuncio.save();

    res.json(respuesta);
  } catch (error) {
    console.error('Error al responder anuncio de venta:', error);
    res.status(500).json({ error: error.message });
  }
};

// Aceptar respuesta (finalizar venta)
const aceptarRespuesta = async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const usuarioId = req.user.id;

    const anuncio = await AnuncioVenta.findByPk(anuncioId);
    if (!anuncio || anuncio.usuarioId !== usuarioId)
      return res.status(400).json({ error: 'Anuncio no encontrado o acceso denegado' });

    if (anuncio.estado !== 'esperando_pago')
      return res.status(400).json({ error: 'No hay respuesta para aceptar' });

    const respuesta = await RespuestaVenta.findOne({ where: { anuncioVentaId: anuncioId } });
    if (!respuesta || respuesta.estado !== 'pendiente')
      return res.status(400).json({ error: 'Respuesta no válida' });

    const billetera = await Billetera.findOne({
      where: { usuarioId, monedaId: anuncio.monedaId },
    });

    if (!billetera) {
      return res.status(400).json({ error: 'No tienes una billetera para esta moneda.' });
    }

    billetera.saldo += parseFloat(anuncio.cantidadDisponible);
    await billetera.save();

    const transaccion = await Transaccion.create({
      tipo: 'venta',
      monto: anuncio.cantidadDisponible,
      moneda: anuncio.monedaId,
      billeteraId: billetera.id,
      usuarioId,
      estado: 'completada',
    });

    respuesta.estado = 'pagado';
    anuncio.estado = 'finalizado';
    await respuesta.save();
    await anuncio.save();

    res.json({ mensaje: 'Venta finalizada y saldo actualizado', transaccion });
  } catch (error) {
    console.error('Error al aceptar respuesta de venta:', error);
    res.status(500).json({ error: error.message });
  }
};

// Cancelar venta
const cancelarVenta = async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const usuarioId = req.user.id;

    const anuncio = await AnuncioVenta.findByPk(anuncioId);
    if (!anuncio || anuncio.usuarioId !== usuarioId)
      return res.status(400).json({ error: 'Anuncio no encontrado o acceso denegado' });

    if (anuncio.estado === 'finalizado' || anuncio.estado === 'cancelado')
      return res.status(400).json({ error: 'Venta ya finalizada o cancelada' });

    const respuesta = await RespuestaVenta.findOne({ where: { anuncioVentaId: anuncioId } });
    if (respuesta) {
      respuesta.estado = 'cancelado';
      await respuesta.save();
    }

    anuncio.estado = 'cancelado';
    await anuncio.save();

    res.json({ mensaje: 'Venta cancelada correctamente' });
  } catch (error) {
    console.error('Error al cancelar venta:', error);
    res.status(500).json({ error: error.message });
  }
};

// Ver mis ventas
const verMisVentas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const misVentas = await AnuncioVenta.findAll({
      where: { usuarioId },
      include: [
        { model: RespuestaVenta },
        { model: Moneda, attributes: ['nombre', 'simbolo'] },
      ],
    });

    res.json(misVentas);
  } catch (error) {
    console.error('Error al obtener mis ventas:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearAnuncioVenta,
  listarAnuncios,
  responderAnuncio,
  aceptarRespuesta,
  cancelarVenta,
  verMisVentas
};
