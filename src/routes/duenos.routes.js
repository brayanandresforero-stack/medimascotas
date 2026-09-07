const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/duenos.controller');

// Ruta para que un dueño se registre (POST)
router.post('/registro', ctrl.registrarDueno);

module.exports = router;