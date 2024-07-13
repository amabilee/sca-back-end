import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Unidade = db.define(
    'Unidade',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        nivel_acesso: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ativo_unidade: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        maximo_efetivo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maximo_veiculo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sinc: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        tableName: 'unidade'
    }
);

export default Unidade;
