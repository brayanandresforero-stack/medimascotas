const { Router } = require('express');
const { obtenerVeterinaria } = require('../controllers/veterinaria.controller');

const router = Router();

router.get('/', obtenerVeterinaria);

module.exports = router;