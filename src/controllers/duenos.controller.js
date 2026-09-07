const pool = require('../config/db');

// Registrar un nuevo dueño de mascota
const registrarDueno = async (req, res) => {
  try {
    const { Nombre, Apellido, Direccion, Telefono } = req.body;

    if (!Nombre || !Apellido || !Telefono) {
      return res.status(400).json({ ok: false, msg: 'Nombre, Apellido y Teléfono son obligatorios' });
    }

    // Nota: Asegúrate de que el nombre de la tabla coincida exactamente con tu base de datos (dueñomascota)
    const query = `INSERT INTO dueñomascota (Nombre, Apellido, Direccion, Telefono) VALUES (?, ?, ?, ?)`;
    
    const [result] = await pool.query(query, [Nombre, Apellido, Direccion || null, Telefono]);

    res.status(201).json({ 
      ok: true, 
      msg: 'Dueño registrado exitosamente', 
      IdDueño: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { registrarDueno };