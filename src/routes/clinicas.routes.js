const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clinicas.controller');

// Ruta GET para listar las clínicas
router.get('/', ctrl.obtenerClinicas);

module.exports = router;