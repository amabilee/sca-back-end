import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const VeiculoSemAn = db.define('VeiculoSemAn', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  cor_veiculo: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  placa: {
    type: DataTypes.STRING(7),
    allowNull: false
  },
  modelo: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  marca: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  renavam: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  cracha: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  ativo_veiculo: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 1
  },
  sinc_veiculo: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'veiculo_sem_an',
  timestamps: false
});

export default VeiculoSemAn;
