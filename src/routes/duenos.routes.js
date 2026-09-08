const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/empleados.controller');

// Ruta para registrar un empleado
router.post('/registro', ctrl.registrarEmpleado);
router.get('/clinica/:id', ctrl.obtenerEmpleadosPorClinica);

module.exports = router;