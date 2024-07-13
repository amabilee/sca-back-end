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
		nome: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		cpf: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		usuario: {
			type: DataTypes.INTEGER,
			allowNull: true,
			unique: true
		},
		senha: {
			type: DataTypes.STRING(64),
			allowNull: false
		},
		nivel_acesso: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		modulos:{
			type: DataTypes.STRING(256),
			allowNull: false
		},
		ativo_usuario: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},
	{
		tableName: 'usuario'
	}
);

export default Usuario;
