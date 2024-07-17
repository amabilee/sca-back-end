import Entity from '../models/Veiculo.js';
import QRCode from '../models/QRCode.js';

class VeiculoController {
	static getAllEntities = async (req, res) => {
		const { page = 1, ...filters } = req.query;
		const limit = 10;
		let whereClause = {};
		
		Object.keys(filters).forEach(key => {
			if (filters[key]) {
				if (key === 'qrcode') {
					whereClause[key] = {
						[Op.eq]: filters[key]
					};
				} else if (key === 'tipo' || key === 'cor_veiculo' || key === 'placa' || key === 'modelo' || key === 'marca') {
					whereClause[key] = {
						[Op.like]: `%${filters[key]}%`
					};
				} else if (key === 'renavam') {
					whereClause[key] = {
						[Op.eq]: filters[key]
					};
				} else if (key === 'ativo_veiculo') {
					whereClause[key] = {
						[Op.eq]: filters[key] === 'true'
					};
				} else if (key === 'sinc_veiculo') {
					whereClause[key] = {
						[Op.eq]: filters[key]
					};
				}
			}
		});

		try {
			const { count: totalRegisters, rows: entities } = await Entity.findAndCountAll({
				where: whereClause,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const lastPage = Math.ceil(totalRegisters / limit);
			const pagination = {
				path: '/veiculo',
				page: Number(page),
				prev_page: page > 1 ? Number(page) - 1 : false,
				next_page: Number(page) < lastPage ? Number(page) + 1 : false,
				lastPage,
				totalRegisters
			};

			res.status(200).json({ entities, pagination });
		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static getEntityById = async (req, res) => {
		try {
			const entity = await Entity.findByPk(req.params.id);
			if (entity) {
				return res.status(200).json(entity);
			} else {
				return res.status(404).send({
					message: `Veiculo ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		let createdQRCode;

		try {
			const {
				id_efetivo,
				tipo,
				cor_veiculo,
				placa,
				modelo,
				marca,
				renavam,
				ativo_veiculo,
				sinc_veiculo
			} = req.body;

			createdQRCode = await QRCode.create({
				nivel_acesso: req.body.nivel_acesso,
				entity: 'veiculo'
			});

			const createdEntity = await Entity.create({
				id_efetivo,
				tipo,
				cor_veiculo,
				placa,
				modelo,
				marca,
				renavam,
				qrcode: createdQRCode.qrcode,
				ativo_veiculo,
				sinc_veiculo
			});

			return res.status(201).json(createdEntity);
		} catch (error) {
			if (createdQRCode) {
				await createdQRCode.destroy();
			}
			if (error.name === 'SequelizeUniqueConstraintError') {
				return res.status(400).send({ message: 'Valores já cadastrados!' });
			} else {
				return res.status(500).send({ message: `${error.message}` });
			}
		}
	};

	static updateEntity = async (req, res) => {
		try {
			const { id } = req.params;
			const {
				id_efetivo,
				tipo,
				cor_veiculo,
				placa,
				modelo,
				marca,
				renavam,
				qrcode,
				ativo_veiculo,
				sinc_veiculo
			} = req.body;

			const [updatedRows] = await Entity.update(
				{
					id_efetivo,
					tipo,
					cor_veiculo,
					placa,
					modelo,
					marca,
					renavam,
					qrcode,
					ativo_veiculo,
					sinc_veiculo
				},
				{ where: { id } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'Veiculo updated successfully' });
			} else {
				res.status(404).send({
					message: `Veiculo ${id} not found!`
				});
			}
		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static deleteEntity = async (req, res) => {
		try {
			const entity = await Entity.findByPk(req.params.id);
			if (entity) {
				await entity.destroy();
				return res.status(204).send();
			} else {
				return res.status(404).send({
					message: `Veiculo ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};
}

export default VeiculoController;
