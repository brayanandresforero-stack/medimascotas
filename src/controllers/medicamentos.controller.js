const pool = require('../config/db');

// get medicamentos (Existente)
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM medicamentos');
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// get medicamento by ID (Existente)
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM medicamentos WHERE IDMedicamentos = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Medicamento no encontrado' });
    }
    
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// NUEVO: Obtener los medicamentos y el stock de una veterinaria específica (Inventario)
const getInventarioVeterinaria = async (req, res) => {
  try {
    const { idVeterinaria } = req.params;
    const query = `
      SELECT m.IDMedicamentos, m.NombreMedicamento, m.TipoMedicamento, m.Especie,
             i.Cantidad AS Stock, i.Precio AS PrecioVenta
      FROM medicamentos m
      INNER JOIN inventario i ON m.IDMedicamentos = i.IDMedicamentos
      WHERE i.IDVeterinaria = ?
    `;
    const [rows] = await pool.query(query, [idVeterinaria]);
    
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { getAll, getById, getInventarioVeterinaria };