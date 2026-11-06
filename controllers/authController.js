const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ erro: 'Nome obrigatório' });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({ erro: 'Email obrigatório' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      mensagem: 'Usuário criado',
      usuario: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno' });
  }

};

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ erro: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ erro: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      mensagem: 'Login realizado',
      token,
      usuario: {          // ← adicionado
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno' });
  }

};

const me = async (req, res) => {

  try {

    const user = await User.findByPk(req.user.id,
      {
        attributes: ['id', 'name', 'email']
      }
    );

    if (!user) {
      return res.status(404).json({
        erro: 'Usuário não encontrado'
      });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      erro: 'Erro interno'
    });

  }

};

module.exports = {
  register,
  login,
  me
};