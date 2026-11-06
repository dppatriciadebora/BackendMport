const express = require('express');

const router = express.Router();

const {
  listarProdutos,
  buscarProduto
}
=
require('../controllers/produtoController');

router.get(
  '/produtos',
  listarProdutos
);

router.get(
  '/produtos/:id',
  buscarProduto
);

module.exports = router;