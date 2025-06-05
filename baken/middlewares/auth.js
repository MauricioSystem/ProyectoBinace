const { User } = require('../models');

const auth = async (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  // Si el token incluye la palabra Bearer, quitamos el prefijo
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  const user = await User.findOne({ where: { token } });
  if (!user) return res.status(401).json({ error: 'Token inválido' });

  req.user = user;
  next();
};

module.exports = auth;
