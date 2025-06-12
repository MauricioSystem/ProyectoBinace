const express = require('express');
const router = express.Router();
const monedaController = require('../controllers/moneda.controller.js');
const authMiddleware = require('../middlewares/auth'); 


router.get('/', monedaController.getAllMonedas);
router.get('/:id', monedaController.getMonedaById);
router.post('/', monedaController.createMoneda);
router.put('/:id', monedaController.updateMoneda);
router.delete('/:id', monedaController.deleteMoneda);

module.exports = router;
