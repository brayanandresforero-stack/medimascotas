const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/duenos.controller');

// Ruta para registrar un dueño (POST)
router.post('/registro', ctrl.registrarDueno);

// Rutas para listar dueños y consultar sus mascotas
router.get('/', ctrl.getAll);
router.get('/:id/mascotas', ctrl.getMisMascotas);

module.exports = router;