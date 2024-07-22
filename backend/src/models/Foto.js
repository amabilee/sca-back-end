import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../config/dbConnect.js';


const Foto = db.define(
    'Foto',
    {
        id_foto: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        id_efetivo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'efetivo',
                key: 'id'
            }
        },
        foto: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        },
        ativo_foto: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        sinc_foto: {
            type: DataTypes.BIGINT,
            allowNull: true
        }  
    },
    {
        tableName: 'foto',
		timestamps: false
    }
)

export default Foto;
