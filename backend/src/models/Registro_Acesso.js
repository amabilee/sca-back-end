import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const RegistroAcesso = db.define(
  'RegistroAcesso',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo: {
      type: DataTypes.STRING(20),
      allowNull: false, 
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_posto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posto',
        key: 'id',
      },
    },
    qrcode: {
      type: DataTypes.INTEGER(7).UNSIGNED.ZEROFILL,
      references: {
        model: 'qrcode',
        key: 'qrcode',
      },
      allowNull: true,
    },
    cracha_pessoa: {
      type: DataTypes.INTEGER,
      references: {
        model: 'cracha',
        key: 'numero_cracha',
      },
      allowNull: true,
    },
    cracha_veiculo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'cracha',
        key: 'numero_cracha',
      },
      allowNull: true,
    },
    id_visitante: {
      type: DataTypes.INTEGER,
      references: {
        model: 'visitante',
        key: 'id',
      },
      allowNull: true,
    },
    id_dependente: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dependente',
        key: 'id',
      },
      allowNull: true,
    },
    id_veiculo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'veiculo',
        key: 'id',
      },
      allowNull: true,
    },
    id_veiculo_sem_an: {
      type: DataTypes.INTEGER,
      references: {
        model: 'veiculo_sem_an',
        key: 'id',
      },
      allowNull: true,
    },
    autorizador: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    sentinela: {
      type: DataTypes.INTEGER(7).UNSIGNED.ZEROFILL,
      references: {
        model: 'qrcode',
        key: 'qrcode',
      },
      allowNull: true,
    },
    sinc_acesso: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    detalhe: {
      type: DataTypes.STRING(50),
      allowNull: true,
    }
  },
  {
    tableName: 'registro_acesso',
	timestamps: false,
  }
);

export default RegistroAcesso;
