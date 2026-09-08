const pool = require('../config/db');

// Obtener todas las clínicas para el selector
const obtenerClinicas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clinicas');
        res.json({ ok: true, data: rows });
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};

module.exports = { obtenerClinicas };