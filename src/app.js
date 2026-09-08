const express = require('express');
const cors = require('cors');
const path = require('path');

const medicamentosRoutes = require('./routes/medicamentos.routes');
const veterinariosRoutes = require('./routes/veterinarios.routes');
const empleadosRoutes = require('./routes/empleados.routes');
const duenosRoutes = require('./routes/duenos.routes');
const mascotaRoutes = require('./routes/mascota.routes');
const clinicasRoutes = require('./routes/clinicas.routes');
const veterinariaRoutes = require('./routes/veterinaria.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// interfaz visual 
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/veterinarios', veterinariosRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/duenos', duenosRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/clinicas', clinicasRoutes);
app.use('/api/veterinaria', veterinariaRoutes);
module.exports = app;