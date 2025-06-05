const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const ventaController = require('../controllers/Venta.controller');
const authMiddleware = require('../middlewares/auth');

router.get('/anuncios', authMiddleware, ventaController.listarAnuncios);
router.post('/anuncios', authMiddleware, upload.single('imagenMetodoPago'), ventaController.crearAnuncioVenta);
router.post('/anuncios/:anuncioId/responder', authMiddleware, upload.single('imagenComprobante'), ventaController.responderAnuncio);
router.post('/anuncios/:anuncioId/aceptar', authMiddleware, ventaController.aceptarRespuesta);
router.post('/anuncios/:anuncioId/cancelar', authMiddleware, ventaController.cancelarVenta);
router.get('/anuncios/mis-ventas', authMiddleware, ventaController.verMisVentas);

module.exports = router;
