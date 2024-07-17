import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';
import Usuario from './Usuario.js';
import Modulo from './Modulo.js';

const UsuarioHasModulo = db.define(
	'UsuarioHasModulo',
	{
		id_usuario: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Usuario,
				key: 'id'
			},
			primaryKey: true
		},
		id_modulo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Modulo,
				key: 'id'
			},
			primaryKey: true
		}
	},
	{
		tableName: 'usuario_has_modulo',
		timestamps: false
	}
);

export default UsuarioHasModulo;
