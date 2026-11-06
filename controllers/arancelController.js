const sequelize = require('../db/database');
const { QueryTypes } = require('sequelize');

exports.buscarPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const resultado = await sequelize.query(
      `SELECT * FROM arancel WHERE codigo LIKE :codigo LIMIT 10`,
      { replacements: { codigo: `${codigo}%` }, type: QueryTypes.SELECT }
    );
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar arancel' });
  }
};

exports.buscarPorDescricao = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }
    const resultado = await sequelize.query(
      `SELECT codigo, descripcion, ga_porcentaje
      FROM arancel
       WHERE LOWER(descripcion) LIKE LOWER(:q) 
       ORDER BY codigo
       LIMIT 10`,
      { replacements: { q: `%${q}%` }, type: QueryTypes.SELECT }
    );
    res.json(resultado);
  } catch (err) {
    console.error('Erro busca arancel:', err)
    res.status(500).json({ erro: 'Erro ao buscar' });
  }
};