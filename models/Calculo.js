const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Calculo = sequelize.define('Calculo', {
   user_id: DataTypes.INTEGER,
   hs_code: DataTypes.STRING,
   incoterm: DataTypes.STRING,
   valor_mercadoria: DataTypes.FLOAT,
   frete: DataTypes.FLOAT,
   seguro: DataTypes.FLOAT,
   total_usd: DataTypes.FLOAT,
   total_bob: DataTypes.FLOAT,
   taxa_cambio: DataTypes.FLOAT,
   created_at: DataTypes.DATE,
}, {
   tableName: 'calculos',
   timestamps: false,
   underscored: true
});

module.exports = Calculo;