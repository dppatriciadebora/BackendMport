const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const HsCode = sequelize.define('HsCode', {
  code: { 
    type: DataTypes.STRING, 
    unique: true 
  },
  description: DataTypes.TEXT,
  ga_rate: DataTypes.FLOAT,
  ice_rate: DataTypes.FLOAT,
}, {
  tableName: 'hs_codes',
  timestamps: false
});

module.exports = HsCode;