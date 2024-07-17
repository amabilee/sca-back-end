import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Modulo = db.define(
	'Modulo',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		descricao: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		link: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		icone: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		ordem: {
			type: DataTypes.TINYINT,
			allowNull: false
		}
	},
	{
		tableName: 'modulo',
		timestamps: false
	}
);

export default Modulo;
