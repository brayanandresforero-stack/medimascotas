const pool = require('../config/db');

// get veterinarios (Existente)
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM veterinarios');
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// get veterinario by ID (Existente)
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

// NUEVO: Obtener la información del veterinario y su clínica asignada
const getDashboardVeterinario = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT v.IDVeterinario, v.Nombre, v.Apellido, v.Especialidad, 
             vet.IDVeterinaria, vet.nombre AS NombreClinica, vet.direccion, vet.telefono AS TelefonoClinica
      FROM veterinarios v
      LEFT JOIN veterinaria vet ON v.IDVeterinaria = vet.IDVeterinaria
      WHERE v.IDVeterinario = ?
    `;
    const [rows] = await pool.query(query, [id]);
    
    if (rows.length === 0) return res.status(404).json({ ok: false, msg: 'Veterinario no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// NUEVO: Obtener los empleados que pertenecen a la MISMA veterinaria que el veterinario
const getMisEmpleados = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT e.IdEmpleado, e.nombre, e.apellido, e.cargo, e.telefono, e.email
      FROM empleados e
      INNER JOIN veterinarios v ON e.IDVeterinaria = v.IDVeterinaria
      WHERE v.IDVeterinario = ?
    `;
    const [rows] = await pool.query(query, [id]);
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// NUEVO: Obtener los pacientes (mascotas) que este veterinario ha atendido
const getMisPacientes = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT DISTINCT m.IDMascota, m.Nombre AS Mascota, m.Especie, m.Raza, 
                      d.Nombre AS NombreDueno, d.Telefono AS TelefonoDueno
      FROM mascota m
      INNER JOIN dueñomascota d ON m.IdDueño = d.IdDueño
      INNER JOIN historialclinico h ON m.IDMascota = h.IDMascota
      WHERE h.IDVeterinario = ?
    `;
    const [rows] = await pool.query(query, [id]);
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Exportar todas las funciones
module.exports = { 
  getAll, 
  getById, 
  getDashboardVeterinario, 
  getMisEmpleados, 
  getMisPacientes 
};