const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Pedido = sequelize.define('Pedido', {
  produto_id: DataTypes.INTEGER,
  importador_id: DataTypes.INTEGER,
  cliente_id: DataTypes.INTEGER,
  status: DataTypes.STRING,
  mensagem: DataTypes.TEXT,
}, {
  tableName: 'pedidos',
  timestamps: false
});

module.exports = Pedido;