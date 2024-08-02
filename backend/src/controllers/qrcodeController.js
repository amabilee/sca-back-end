import QRCode from '../models/QRCode.js';
import Visitante from '../models/Visitante.js';
import Dependente from '../models/Dependente.js';
import Veiculo from '../models/Veiculo.js';
import Efetivo from '../models/Efetivo.js';

class QRCodeController {
	static getAllEntities = async (req, res) => {
		const { page = 1 } = req.query;
		const limit = 15;
		let lastPage = 1;

		try {
			const { count, rows: entities } = await QRCode.findAndCountAll({
				order: [['qrcode', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const pagination = {
				path: '/qrcode',
				page,
				prev_page: page - 1 >= 1 ? page - 1 : false,
				next_page: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
				lastPage,
				totalRegisters: count
			};

			res.status(200).json({ entities, pagination });
		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static getEntityByQRCode = async (req, res) => {
		const { qrcode } = req.params;

		try {
			const entity = await QRCode.findByPk(qrcode);

			if (entity) {
				const fullEntity = await this._getEntity(entity);
				return res.status(200).json(fullEntity);
			} else {
				return res.status(404).send({
					message: `QRCode ${qrcode} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		const { qrcode, nivel_acesso } = req.body;

		try {
			const createdEntity = await QRCode.create({
				qrcode,
				nivel_acesso
			});

			res.status(201).json({ message: 'QrCode created'});
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				res.status(400).send({ message: 'QRCode already exists!' });
			} else {
				res.status(500).send({ message: `${error.message}` });
			}
		}
	};

	static updateEntity = async (req, res) => {
		const { qrcode } = req.params;
		const { nivel_acesso, entity } = req.body;

		try {
			const [updatedRows] = await QRCode.update(
				{
					nivel_acesso,
					entity
				},
				{ where: { qrcode } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'QRCode updated successfully' });
			} else {
				res.status(404).send({
					message: `QRCode ${qrcode} not found!`
				});
			}
		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static deleteEntity = async (req, res) => {
		const { qrcode } = req.params;

		try {
			const entity = await QRCode.findByPk(qrcode);

			if (entity) {
				await entity.destroy();
				res.status(204).send();
			} else {
				res.status(404).send({
					message: `QRCode ${qrcode} not found!`
				});
			}
		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static _getEntity = async (qrcode) => {
		let fullEntity = { ...qrcode.dataValues };

		switch (qrcode.entity) {
			case 'efetivo':
				const efetivo = await Efetivo.findOne({ where: { qrcode_efetivo: qrcode.qrcode } });
				fullEntity = { ...fullEntity, efetivo: efetivo ? efetivo.dataValues : null };
				break;
			case 'visitante':
				const visitante = await Visitante.findOne({ where: { qrcode_visitante: qrcode.qrcode } });
				fullEntity = { ...fullEntity, visitante: visitante ? visitante.dataValues : null };
				break;
			case 'dependente':
				const dependente = await Dependente.findOne({ where: { qrcode: qrcode.qrcode } });
				fullEntity = { ...fullEntity, dependente: dependente ? dependente.dataValues : null };
				break;
			case 'veiculo':
				const veiculo = await Veiculo.findOne({ where: { qrcode: qrcode.qrcode } });
				fullEntity = { ...fullEntity, veiculo: veiculo ? veiculo.dataValues : null };
				break;
			default:
				break;
		}

		return fullEntity;
	};
}

export default QRCodeController;
