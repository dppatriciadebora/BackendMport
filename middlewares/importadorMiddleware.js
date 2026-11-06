const { QueryTypes } = require('sequelize');
const sequelize = require('../db/database');

const importadorMiddleware = async (req, res, next) => {
  try {
    const [user] = await sequelize.query(
      `SELECT role FROM users WHERE id = :id`,
      { replacements: { id: req.user.id }, type: QueryTypes.SELECT }
    );

    if (!user || user.role !== 'importador') {
      return res.status(403).json({ erro: 'Acesso restrito a importadores' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao verificar permissão' });
  }
};

module.exports = importadorMiddleware;