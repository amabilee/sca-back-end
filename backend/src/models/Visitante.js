import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Visitante = db.define(
	'Visitante',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		cpf: {
			type: DataTypes.BIGINT(11),
			allowNull: false,
		},
		nome: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		rua: {
			type: DataTypes.STRING(30),
			allowNull: true,
			defaultValue: null
		},
		numero: {
			type: DataTypes.STRING(10),
			allowNull: true,
			defaultValue: null
		},
		bairro: {
			type: DataTypes.STRING(40),
			allowNull: true,
			defaultValue: null
		},
		estado: {
			type: DataTypes.STRING(20),
			allowNull: true,
			defaultValue: null
		},
		complemento: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: null
		},
		telefone: {
			type: DataTypes.STRING(11),
			allowNull: false,
		},
		foto: {
			type: DataTypes.BLOB('long'),
			allowNull: true,
			defaultValue: null
		},
		empresa: {
			type: DataTypes.STRING(45),
			allowNull: false,
		},
		cracha: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: null
		},
		ativo_visitante: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: true
		},
		sinc: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: null
		},
	},
	{
		tableName: 'visitante',
		timestamps: false
	}
);

export default Visitante;
