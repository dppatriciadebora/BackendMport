const express = require('express');

const router = express.Router();

const {
  register,
  login,
  me
} = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');

// cadastro
router.post('/auth/register', register);

// login
router.post('/auth/login', login);

router.get('/teste', (req, res) => {
  res.json({
    mensagem: 'rota teste funcionando'
  });
});

router.get(
  '/auth/me',
  authMiddleware,
  me
);

module.exports = router;