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

// Obtener la información de la veterinaria unida con el veterinario por ID
const obtenerVeterinaria = async (req, res) => {
  try {
    const query = `
      SELECT vet.IDVeterinaria, vet.nombre AS nombreClinica, 
             v.IDVeterinario, v.Nombre AS nombreVet, v.Apellido AS apellidoVet
      FROM veterinaria vet
      LEFT JOIN veterinarios v ON vet.IDVeterinaria = v.IDVeterinaria
    `;
    const [rows] = await pool.query(query);
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Obtener la información del veterinario y su clínica asignada
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

// Obtener los empleados que pertenecen a la MISMA veterinaria que el veterinario
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

// Obtener los pacientes (mascotas) que este veterinario ha atendido
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

// Función opcional todo en uno para traer el panel completo (Veterinario, Clínica y sus Empleados de golpe)
const getDashboardCompleto = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener veterinario y su clínica
    const [vetRows] = await pool.query(`
      SELECT v.IDVeterinario, v.Nombre, v.Apellido, v.Especialidad, 
             vet.IDVeterinaria, vet.nombre AS NombreClinica, vet.direccion, vet.telefono AS TelefonoClinica
      FROM veterinarios v
      LEFT JOIN veterinaria vet ON v.IDVeterinaria = vet.IDVeterinaria
      WHERE v.IDVeterinario = ?
    `, [id]);

    if (vetRows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Veterinario no encontrado' });
    }

    const veterinario = vetRows[0];

    // 2. Obtener empleados de esa misma veterinaria
    let empleados = [];
    if (veterinario.IDVeterinaria) {
      const [empRows] = await pool.query(`
        SELECT e.IdEmpleado, e.nombre, e.apellido, e.cargo, e.telefono, e.email
        FROM empleados e
        WHERE e.IDVeterinaria = ?
      `, [veterinario.IDVeterinaria]);
      empleados = empRows;
    }

    res.json({
      ok: true,
      veterinario,
      empleados
    });

  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Exportar todas las funciones incluyendo la nueva de veterinaria unida
module.exports = { 
  getAll, 
  getById, 
  obtenerVeterinaria,
  getDashboardVeterinario, 
  getMisEmpleados, 
  getMisPacientes,
  getDashboardCompleto 
};