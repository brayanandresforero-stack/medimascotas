const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/duenos.controller');

router.post('/registro', ctrl.registrarDueno);
router.get('/', ctrl.getAll);
router.get('/:id/mascotas', ctrl.getMisMascotas);

module.exports = router;
