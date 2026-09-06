const express = require('express');
const cors = require('cors');

const medicamentosRoutes = require('./routes/medicamentos.routes');
const veterinariosRoutes = require('./routes/veterinarios.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/veterinarios', veterinariosRoutes);

module.exports = app;