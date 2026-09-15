const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/duenos.controller');

// Rutas para dueños de mascotas
router.post('/registro', ctrl.registrarDueno);
router.put('/:id', ctrl.actualizarDueno);
router.get('/', ctrl.getAll);
router.get('/:id/mascotas', ctrl.getMisMascotas);

module.exports = router;