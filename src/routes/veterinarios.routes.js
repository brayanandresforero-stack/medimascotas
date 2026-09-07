const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/veterinarios.controller');

// Rutas generales
router.get('/', ctrl.getAll);

// Rutas de veterinario
router.get('/:id/dashboard', ctrl.getDashboardVeterinario);
router.get('/:id/empleados', ctrl.getMisEmpleados);
router.get('/:id/pacientes', ctrl.getMisPacientes);

// Ruta por ID
router.get('/:id', ctrl.getById);

module.exports = router;