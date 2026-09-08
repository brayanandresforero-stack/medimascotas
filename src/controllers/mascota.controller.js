const pool = require('../config/db');

// Obtener todas las mascotas
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mascota');
    res.json({ ok: true, data: rows });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Obtener una mascota por ID
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM mascota WHERE IDMascota = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, msg: 'Mascota no encontrada' });
    }

    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Registrar una nueva mascota
const create = async (req, res) => {
  try {
    const { Nombre, Especie, Raza, Genero, IdDueño } = req.body;

    if (!Nombre) {
      return res.status(400).json({ ok: false, msg: 'El nombre de la mascota es obligatorio' });
    }

    const query = `INSERT INTO mascota (Nombre, Especie, Raza, Genero, IdDueño) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [Nombre, Especie || null, Raza || null, Genero || null, IdDueño || null]);

    res.status(201).json({
      ok: true,
      msg: 'Mascota registrada exitosamente',
      IDMascota: result.insertId
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Actualizar una mascota existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Especie, Raza, Genero, IdDueño } = req.body;

    const query = `
      UPDATE mascota
      SET Nombre = COALESCE(?, Nombre),
          Especie = COALESCE(?, Especie),
          Raza = COALESCE(?, Raza),
          Genero = COALESCE(?, Genero),
          IdDueño = COALESCE(?, IdDueño)
      WHERE IDMascota = ?
    `;
    const [result] = await pool.query(query, [Nombre, Especie, Raza, Genero, IdDueño, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Mascota no encontrada' });
    }

    res.json({ ok: true, msg: 'Mascota actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

// Eliminar una mascota
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM mascota WHERE IDMascota = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Mascota no encontrada' });
    }

    res.json({ ok: true, msg: 'Mascota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };