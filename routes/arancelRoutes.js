const express = require('express');
const router = express.Router();
const { buscarPorCodigo, buscarPorDescricao } = require('../controllers/arancelController');

router.get('/codigo/:codigo', buscarPorCodigo);
router.get('/buscar', buscarPorDescricao);

module.exports = router;