//controller/auth.controller.js
const bcrypt = require('bcrypt');
const User = require('../models/user'); 

exports.register = async (req, res) => {
  try {
    const { username, password, esAdmin = false } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, esAdmin }); 

    res.status(201).json({ message: 'Usuario creado', userId: user.id });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas - usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas - contraseña incorrecta' });
    }

    const token = `token-${user.id}-${Date.now()}`;
    user.token = token;
    await user.save();

    res.json({
      token,
      userId: user.id,
      username: user.username,
      esAdmin: user.esAdmin 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'username', 'esAdmin'], 
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { esAdmin } = req.body;

    if (typeof esAdmin !== 'boolean') {
      return res.status(400).json({ error: 'esAdmin debe ser booleano' });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.esAdmin = esAdmin;
    await usuario.save();

    res.json({ message: 'Rol actualizado', usuario: { id: usuario.id, username: usuario.username, esAdmin: usuario.esAdmin } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
