const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const compraController = require('../controllers/compra.controller');
const authMiddleware = require('../middlewares/auth');

router.get('/anuncios', authMiddleware, compraController.listarAnuncios);
router.post('/anuncios', authMiddleware, upload.single('imagen'), compraController.crearAnuncioCompra);
router.post('/anuncios/:anuncioId/responder', authMiddleware, upload.single('imagen'), compraController.responderAnuncio);
router.post('/anuncios/:anuncioId/aceptar', authMiddleware, compraController.aceptarRespuesta);
router.post('/anuncios/:anuncioId/cancelar', authMiddleware, compraController.cancelarCompra);
router.get('/anuncios/mis-anuncios', authMiddleware, compraController.misAnuncios);

module.exports = router;
