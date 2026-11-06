const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Produto = sequelize.define('Produto', {

  nome: DataTypes.STRING,

  marca: DataTypes.STRING,

  modelo: DataTypes.STRING,

  preco_usd: DataTypes.DECIMAL,

  descricao: DataTypes.TEXT,

  foto_url: DataTypes.TEXT,

  whatsapp: DataTypes.STRING,

  estoque: DataTypes.INTEGER

}, {

  tableName: 'produtos',
  timestamps: false

});

module.exports = Produto;