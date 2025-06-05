// middlewares/admin.js
module.exports = (req, res, next) => {
  if (!req.user || !req.user.esAdmin) {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
};
