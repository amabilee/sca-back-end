import Entity from '../models/Alerta.js';
import { Op } from 'sequelize';
import { parse, formatISO, isWithinInterval } from 'date-fns';

class AlertaController {
	static getAllEntities = async (req, res) => {
		const { page = 1, categoria, data } = req.query;
		const limit = 10;
		let lastPage = 1;

		try {
			let whereCondition = {};

			if (categoria) {
				whereCondition.categoria = { [Op.like]: `%${categoria}%` };
			}

			if (data) {
				const [startDateString, endDateString] = data.split(',').map(decodeURIComponent);

				const startDate = new Date(startDateString);
				const endDate = new Date(endDateString);

				if (isNaN(startDate) || isNaN(endDate)) {
					throw new Error('Invalid date format');
				}

				whereCondition.data = {
					[Op.between]: [startDate.toISOString(), endDate.toISOString()]
				};
			}

			whereCondition.ativo_alerta = { [Op.like]: true };

			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const totalPages = Math.ceil(count / limit);

			const pagination = {
				path: '/alertas',
				page,
				prev_page: page - 1 >= 1 ? page - 1 : false,
				next_page: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
				totalPages,
				totalItems: count,
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
				return res.status(400).send({
					message: `Id ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		try {
			const { categoria, mensagem, ativo_alerta, sinc } = req.body;

			const createdEntity = await Entity.create({
				categoria,
				mensagem,
				ativo_alerta,
				sinc
			});
			res.status(201).json(createdEntity);
		} catch (error) {
			if (error.name == 'SequelizeUniqueConstraintError') {
				res.status(400).send({ message: 'Valores já cadastrados!' });
			} else {
				res.status(500).send({ message: `${error.message}` });
			}
		}
	};

	static updateEntity = async (req, res) => {
		try {
			const { categoria, mensagem, ativo_alerta, sinc } = req.body;
			const entityId = req.params.id;

			const [updatedRows] = await Entity.update(
				{
					categoria,
					mensagem,
					ativo_alerta,
					sinc
				},
				{ where: { id: entityId } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(400).send({
					message: `Id ${entityId} not found!`
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
				return res.status(400).send({
					message: `Id ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};
}

export default AlertaController;
