const pool = require('../config/db');

// Obtener todos los veterinarios
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM veterinarios');
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Obtener un veterinario por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM veterinarios WHERE IDVeterinario = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Veterinario no encontrado' });
    }
    
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { getAll, getById };