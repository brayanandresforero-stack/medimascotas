const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/medicamentos.controller');

// Rutas generales
router.get('/', ctrl.getAll);

// Ruta inventario de medicamentos 
router.get('/veterinaria/:idVeterinaria', ctrl.getInventarioVeterinaria);

// Ruta por ID 
router.get('/:id', ctrl.getById);

module.exports = router;