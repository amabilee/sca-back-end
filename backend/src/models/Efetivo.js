import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Efetivo = db.define(
    'Efetivo',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        id_graduacao: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'graduacao',
                key: 'id'
            }
        },
        nome_completo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        nome_guerra: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        foto: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        dependente: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        id_alerta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'alerta',
                key: 'id'
            }
        },
        id_unidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'unidade',
                key: 'id'
            }
        },
        qrcode_efetivo: {
            type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
            allowNull: true,
            unique: true,
            references: {
                model: 'qrcode',
                key: 'qrcode'
            }
        },
        email: {
            type: DataTypes.STRING(40),
            allowNull: false
        },
        cnh: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        val_cnh: {
            type: DataTypes.DATE,
            allowNull: true
        },
        nivel_acesso: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        ativo_efetivo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        sinc_efetivo: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: 1
        }
    },
    {
        tableName: 'efetivo',
        timestamps: false
    }
);

export default Efetivo;
