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
			allowNull: false
		},
		numero: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		bairro: {
			type: DataTypes.STRING(40),
			allowNull: false
		},
		estado: {
			type: DataTypes.STRING(20),
			allowNull: false
		},

		complemento: {
			type: DataTypes.STRING(100),
			allowNull: true,
			defaultValue: null
		},
		telefone: {
			type: DataTypes.STRING(11),
			allowNull: true,
			defaultValue: null
		},
		foto: {
			type: DataTypes.BLOB('long'),
			allowNull: true,
			defaultValue: null
		},
		empresa: {
			type: DataTypes.STRING(45),
			allowNull: true,
			defaultValue: null
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


		// email: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false,
		// 	unique: true
		// },
		// senha: {
		// 	type: DataTypes.STRING(64),
		// 	allowNull: false
		// },
		// tipo_doc: {
		// 	type: DataTypes.STRING(30),
		// 	allowNull: false
		// },
		// num_doc: {
		// 	type: DataTypes.STRING(20),
		// 	allowNull: false
		// },
		// autorizador: {
		// 	type: DataTypes.STRING(45),
		// 	allowNull: true
		// },
		// qrcode_visitante: {
		// 	type: DataTypes.INTEGER,
		// 	references: {
		// 		model: 'qrcode',
		// 		key: 'qrcode'
		// 	},
		// 	allowNull: false
		// },
		// permissionDate: {
		// 	type: DataTypes.DATE,
		// 	allowNull: false,
		// 	defaultValue: DataTypes.NOW
		// },
		
	},
	{
		tableName: 'visitante',
		timestamps: false
	}
);

export default Visitante;
