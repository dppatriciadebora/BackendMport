require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const sequelize = require('./db/database');
const routes = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

const PORT = process.env.PORT || 3000;

// RATE LIMIT

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    erro: 'Muitas requisições. Tente novamente mais tarde.'
  }
});

// MIDDLEWARES

app.use(limiter);

app.use(cors({
  origin: '*'
}));

app.use(express.json());

// ROTAS

app.use('/api', routes);

// ROTA TESTE

app.get('/', (req, res) => {
  res.send('API funcionando');
});

// ERROR HANDLER

app.use(errorHandler);

// CONEXÃO BANCO

sequelize.authenticate()
  .then(() => {

    console.log('Banco conectado');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  })
  .catch((err) => {

    console.error('Erro ao conectar no banco:', err);

    process.exit(1);

  });