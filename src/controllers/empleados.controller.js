const pool = require('../config/db');

// Registrar un nuevo empleado asignado a una veterinaria
const registrarEmpleado = async (req, res) => {
  try {
    const { IDVeterinaria, documento, nombre, apellido, email, telefono, cargo, salario } = req.body;

    // Validación básica
    if (!IDVeterinaria || !documento || !nombre || !apellido) {
      return res.status(400).json({ ok: false, msg: 'IDVeterinaria, documento, nombre y apellido son obligatorios' });
    }

    const query = `
      INSERT INTO empleados (IDVeterinaria, documento, nombre, apellido, email, telefono, cargo, salario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      IDVeterinaria, 
      documento, 
      nombre, 
      apellido, 
      email || null, 
      telefono || null, 
      cargo || 'Auxiliar', 
      salario || 0
    ]);

    res.status(201).json({ 
      ok: true, 
      msg: 'Empleado registrado exitosamente', 
      IdEmpleado: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { registrarEmpleado };