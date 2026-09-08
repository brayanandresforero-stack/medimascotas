const pool = require('../config/db');

// Registrar un nuevo dueño de mascota
const registrarDueno = async (req, res) => {
  try {
    const { Nombre, Apellido, Direccion, Telefono } = req.body;

    if (!Nombre || !Apellido || !Telefono) {
      return res.status(400).json({ ok: false, msg: 'Nombre, Apellido y Teléfono son obligatorios' });
    }

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

// Actualizar un dueño existente por ID
const actualizarDueno = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Apellido, Direccion, Telefono } = req.body;

    const query = `UPDATE dueñomascota SET Nombre = ?, Apellido = ?, Direccion = ?, Telefono = ? WHERE IDDueño = ?`;
    const [result] = await pool.query(query, [Nombre, Apellido, Direccion || null, Telefono, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Dueño no encontrado' });
    }

    res.json({ ok: true, msg: 'Dueño actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { registrarDueno, actualizarDueno };