const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const importadorMiddleware = require('../middlewares/importadorMiddleware');
const {
  ativarImportador,
  meusProdutos,
  cadastrarProduto,
  deletarProduto,
  meusPedidos,
  atualizarPedido
} = require('../controllers/importadorController');

// Qualquer usuário logado pode ativar com código
router.post('/ativar', authMiddleware, ativarImportador);

// Rotas exclusivas de importador
router.get('/produtos', authMiddleware, importadorMiddleware, meusProdutos);
router.post('/produtos', authMiddleware, importadorMiddleware, cadastrarProduto);
router.delete('/produtos/:id', authMiddleware, importadorMiddleware, deletarProduto);
router.get('/pedidos', authMiddleware, importadorMiddleware, meusPedidos);
router.put('/pedidos/:id', authMiddleware, importadorMiddleware, atualizarPedido);

module.exports = router;