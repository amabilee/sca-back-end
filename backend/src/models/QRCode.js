import { DataTypes } from 'sequelize';
import db from '../config/dbConnect.js';

const QRCode = db.define(
	'QRCode',
	{
		qrcode: {
			type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
			primaryKey: true,
			allowNull: false,
		},
		nivel_acesso: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{
		tableName: 'qrcode',
		timestamps: false,
		engine: 'InnoDB',
		charset: 'latin1',
		autoIncrement: false,
	}
);

export default QRCode;
