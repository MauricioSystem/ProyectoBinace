const { AnuncioCompra, RespuestaCompra, Transaccion, Billetera, Moneda, User } = require('../models');
const fs = require('fs');

const crearAnuncioCompra = async (req, res) => {
  try {
    const { descripcion, moneda, cantidad, precioUnitario } = req.body;
    const usuarioId = req.user.id;
    let imagenUrl = null;

    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    }

    const anuncio = await AnuncioCompra.create({
      descripcion,
      moneda,
      cantidad,
      precioUnitario,
      imagenUrl,
      usuarioId,
      estado: 'abierto',
    });

    res.status(201).json(anuncio);
  } catch (error) {
    console.error('Error al crear anuncio:', error);
    res.status(500).json({ error: error.message });
  }
};


const listarAnuncios = async (req, res) => {
  try {
    const { moneda } = req.query;
    let filtro = {};
    if (moneda) filtro.moneda = moneda;

    const anuncios = await AnuncioCompra.findAll({
      where: filtro,
      include: [{ model: User, attributes: ['username'] }],
    });

    res.json(anuncios);
  } catch (error) {
    console.error('Error al listar anuncios:', error);
    res.status(500).json({ error: error.message });
  }
};


const responderAnuncio = async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const vendedorId = req.user.id;

    const anuncio = await AnuncioCompra.findByPk(anuncioId);
    if (!anuncio || anuncio.estado !== 'abierto') {
      return res.status(400).json({ error: 'Anuncio  cerrado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Imagen de respuesta requerida' });
    }

    let respuesta = await RespuestaCompra.findOne({ where: { anuncioId } });
    if (respuesta) {
      if (respuesta.imagenUrl) fs.unlinkSync(`.${respuesta.imagenUrl}`);
      respuesta.imagenUrl = `/uploads/${req.file.filename}`;
      respuesta.estado = 'pendiente';
      respuesta.vendedorId = vendedorId;
      await respuesta.save();
    } else {
      respuesta = await RespuestaCompra.create({
        anuncioId,
        vendedorId,
        imagenUrl: `/uploads/${req.file.filename}`,
        estado: 'pendiente',
      });
    }

    anuncio.estado = 'esperando_respuesta';
    await anuncio.save();

    res.json(respuesta);
  } catch (error) {
    console.error('Error al responder anuncio:', error);
    res.status(500).json({ error: error.message });
  }
};


const aceptarRespuesta = async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const usuarioId = req.user.id;

    const anuncio = await AnuncioCompra.findByPk(anuncioId);
    if (!anuncio || anuncio.usuarioId !== usuarioId) {
      return res.status(400).json({ error: 'Anuncio no encontrado o acceso denegado' });
    }

    if (anuncio.estado !== 'esperando_respuesta') {
      return res.status(400).json({ error: 'No hay respuesta para aceptar' });
    }

    const respuesta = await RespuestaCompra.findOne({ where: { anuncioId } });
    if (!respuesta || respuesta.estado !== 'pendiente') {
      return res.status(400).json({ error: 'Respuesta no válida' });
    }

    const monedaExistente = await Moneda.findOne({ where: { nombre: anuncio.moneda } });
    if (!monedaExistente) {
      return res.status(404).json({ error: 'La moneda no existe en la base de datos.' });
    }

    const billetera = await Billetera.findOne({
      where: { usuarioId, monedaId: monedaExistente.id }
    });

    if (!billetera) {
      return res.status(500).json({ error: 'No tienes una billetera para esta moneda.' });
    }

    billetera.saldo += parseFloat(anuncio.cantidad);
    await billetera.save();


    const transaccion = await Transaccion.create({
      tipo: 'compra',
      monto: anuncio.cantidad,
      moneda: anuncio.moneda,
      billeteraId: billetera.id,
      usuarioId,
      estado: 'completada'
    });

//actualiza
    respuesta.estado = 'aceptado';
    anuncio.estado = 'finalizado';
    await respuesta.save();
    await anuncio.save();

    res.json({ mensaje: 'Compra aceptada y saldo actualizado', transaccion });
  } catch (error) {
    console.error('Error al aceptar respuesta:', error);
    res.status(500).json({ error: error.message });
  }
};

const cancelarCompra = async (req, res) => {
  try {
    const { anuncioId } = req.params;
    const usuarioId = req.user.id;

    const anuncio = await AnuncioCompra.findByPk(anuncioId);
    if (!anuncio || anuncio.usuarioId !== usuarioId) {
      return res.status(400).json({ error: 'Anuncio no encontrado o acceso denegado' });
    }

    if (anuncio.estado === 'finalizado' || anuncio.estado === 'cancelado') {
      return res.status(400).json({ error: 'Compra ya finalizada o cancelada' });
    }

    const respuesta = await RespuestaCompra.findOne({ where: { anuncioId } });
    if (respuesta) {
      respuesta.estado = 'cancelado';
      await respuesta.save();
    }

    anuncio.estado = 'cancelado';
    await anuncio.save();

    res.json({ mensaje: 'Compra cancelada correctamente' });
  } catch (error) {
    console.error('Error al cancelar compra:', error);
    res.status(500).json({ error: error.message });
  }
};


const misAnuncios = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const anuncios = await AnuncioCompra.findAll({
      where: { usuarioId },
      include: [{ model: RespuestaCompra }],
    });

    res.json(anuncios);
  } catch (error) {
    console.error('Error al obtener mis anuncios:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearAnuncioCompra,
  listarAnuncios,
  responderAnuncio,
  aceptarRespuesta,
  cancelarCompra,
  misAnuncios,
};
