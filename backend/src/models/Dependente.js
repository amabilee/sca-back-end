import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Dependente = db.define(
	'Dependente',
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		id_efetivo: {
			type: DataTypes.INTEGER,
			references: {
				model: 'efetivo',
				key: 'id'
			},
			allowNull: false
		},
		cpf: {
			type: DataTypes.BIGINT(11),
			allowNull: false,
			unique: true
		},
		nome: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		parentesco: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		cracha: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		ativo_dependente: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 1
		},
		sinc_dependente: {
			type: DataTypes.BIGINT,
			allowNull: true
		}
	},
	{
		tableName: 'dependente',
		timestamps: false
	}
);

export default Dependente;
