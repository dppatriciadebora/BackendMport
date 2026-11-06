const express = require('express');
const router = express.Router();

const calculoRoutes = require('./calculoRoutes');
const authRoutes = require('./authRoutes');
const produtoRoutes = require('./produtoRoutes');
const arancelRoutes = require('./arancelRoutes');

const authMiddleware = require('../middlewares/authMiddleware');

const importadorRoutes = require('./importadorRoutes');

// Rota de teste
router.get('/ping', (req, res) => {
  res.json({
    ok: true,
    mensagem: 'pong'
  });
});

// Rotas públicas (login, cadastro e perfil)
router.use('/', authRoutes);

// Rotas protegidas de cálculos
router.use('/calculos', authMiddleware, calculoRoutes);

// Rotas do arancel (protegidas)
router.use('/arancel', authMiddleware, arancelRoutes);

// Rotas de produtos
router.use('/', produtoRoutes);

// Rotas de importador
router.use('/importador', importadorRoutes);

module.exports = router;