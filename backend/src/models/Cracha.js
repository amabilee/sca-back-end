import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Cracha = db.define (
    'Cracha',
    {
        numero_cracha: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pessoa: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        veiculo: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        nivel_acesso: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        sinc_cracha: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'cracha',
        timestamps: false
    }
);

export default Cracha