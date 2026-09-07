const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/empleados.controller');

// Ruta para que un empleado se registre (POST)
router.post('/registro', ctrl.registrarEmpleado);

module.exports = router;