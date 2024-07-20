import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Usuario = db.define(
	'Usuario',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		usuario: {
			type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
			allowNull: false,
			unique: true
		},
		senha: {
			type: DataTypes.STRING(60),
			allowNull: false
		},
		nivel_acesso: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		flag: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		auth: {
			type: DataTypes.STRING(255),
			allowNull: true
		}
	},
	{
		tableName: 'usuario',
		timestamps: false
	}
);

export default Usuario;