const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const CodigoConvite = sequelize.define('CodigoConvite', {
  codigo: DataTypes.STRING,
  usado: DataTypes.BOOLEAN,
  usado_por: DataTypes.INTEGER,
}, {
  tableName: 'codigos_convite',
  timestamps: false
});

module.exports = CodigoConvite;