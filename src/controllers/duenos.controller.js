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

// Obtener todos los dueños
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dueñomascota');
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Obtener un dueño por ID, junto con sus mascotas
const getMisMascotas = async (req, res) => {
  try {
    const { id } = req.params;

    const [dueno] = await pool.query('SELECT * FROM dueñomascota WHERE IdDueño = ?', [id]);
    if (dueno.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Dueño no encontrado' });
    }

    const query = `
      SELECT m.IDMascota, m.Nombre, m.Especie, m.Raza, m.Genero
      FROM mascota m
      WHERE m.IdDueño = ?
    `;
    const [mascotas] = await pool.query(query, [id]);

    res.json({
      ok: true,
      dueno: dueno[0],
      mascotas: mascotas
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { registrarDueno, getAll, getMisMascotas };