const { Moneda } = require('../models');


exports.getAllMonedas = async (req, res) => {
  try {
    const monedas = await Moneda.findAll();
    res.json(monedas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
};


exports.getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await Moneda.findByPk(id);
    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }
    res.json(moneda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener moneda' });
  }
};


exports.createMoneda = async (req, res) => {
  try {
    const { nombre, simbolo, tipoCambioUSD } = req.body;
    const moneda = await Moneda.create({ nombre, simbolo, tipoCambioUSD });
    res.status(201).json(moneda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear moneda' });
  }
};


exports.updateMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, simbolo, tipoCambioUSD } = req.body;
    const moneda = await Moneda.findByPk(id);
    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }
    await moneda.update({ nombre, simbolo, tipoCambioUSD });
    res.json(moneda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar moneda' });
  }
};


exports.deleteMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await Moneda.findByPk(id);
    if (!moneda) {
      return res.status(404).json({ error: 'Moneda no encontrada' });
    }
    await moneda.destroy();
    res.json({ message: 'Moneda eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar moneda' });
  }
};
