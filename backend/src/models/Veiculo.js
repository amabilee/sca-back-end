import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const Veiculo = db.define(
	'Veiculo',
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
			allowNull: true
		},
		tipo: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		cor_veiculo: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		placa: {
			type: DataTypes.STRING(7),
			allowNull: true
		},
		modelo: {
			type: DataTypes.STRING(40),
			allowNull: true
		},
		marca: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		renavam: {
			type: DataTypes.BIGINT,
			allowNull: false
		},
		qrcode: {
			type: DataTypes.INTEGER.UNSIGNED.ZEROFILL,
			references: {
				model: 'qrcode',
				key: 'qrcode'
			},
			allowNull: true
		},
		ativo_veiculo: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		sinc_veiculo: {
			type: DataTypes.BIGINT,
			allowNull: true,
			defaultValue: 1
		}
	},
	{
		tableName: 'veiculo',
		timestamps: false
	}
);

export default Veiculo;
