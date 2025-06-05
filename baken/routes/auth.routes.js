const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const admin = require('../middlewares/admin');
const auth = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/', auth, admin, authController.listarUsuarios);       // Listar usuarios
router.put('/:id/rol', auth, admin, authController.cambiarRol);    // Cambiar rol admin o usuario


module.exports = router;
