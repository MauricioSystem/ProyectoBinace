const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const transferenciaController = require('../controllers/transferencia.controller.js');

router.post('/', auth, transferenciaController.realizarTransferencia);

module.exports = router;
