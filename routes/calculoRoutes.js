const express = require('express');
const router = express.Router();

const {
  calcularImportacao,
  listarCalculos
} = require('../controllers/calculoController');

// POST /calculos/calcular — protegido pelo index.js
router.post('/calcular', calcularImportacao);

// GET /calculos — protegido pelo index.js
router.get('/', listarCalculos);

module.exports = router;