const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/empleados.controller');

// Ruta para registrar un dueño (POST)
router.post('/registro', ctrl.registrarDueno);

// Rutas para listar dueños y consultar sus mascotas
router.get('/', ctrl.getAll);
router.get('/:id/mascotas', ctrl.getMisMascotas);
// Ruta para registrar un empleado
router.post('/registro', ctrl.registrarEmpleado);
router.get('/clinica/:id', ctrl.obtenerEmpleadosPorClinica);

module.exports = router;