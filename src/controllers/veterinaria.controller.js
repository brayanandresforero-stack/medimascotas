const pool = require('../config/db');

const obtenerVeterinaria = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM veterinaria');
        res.json({ ok: true, data: rows });
    } catch (error) {
        res.status(500).json({ ok: false, msg: error.message });
    }
};

module.exports = { obtenerVeterinaria };