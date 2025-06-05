const express = require('express');
const router = express.Router();
const controlador = require('../controllers/billetera.controller');
const auth = require('../middlewares/auth');


router.post('/', auth, controlador.crearBilletera);
router.get('/', auth, controlador.obtenerBilleterasUsuario);
router.get('/:id/transacciones', auth, controlador.obtenerTransacciones);

module.exports = router;
