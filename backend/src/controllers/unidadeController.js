import { Op } from 'sequelize';
import Entity from '../models/Unidade.js';

class UnidadeController {
	static getAllEntities = async (req, res) => {
		const { page, nome } = req.query;
		const limit = 15;

		try {
			let whereCondition = {}
			if (nome) {
				whereCondition.nome = { [Op.like]: `%${nome}%` }
			}

			whereCondition.ativo_unidade = { [Op.like]: true }
			
			if (page) {
				const { count, rows: entities } = await Entity.findAndCountAll({
					where: whereCondition,
					order: [['id', 'ASC']],
					offset: Number(page * limit - limit),
					limit: limit
				});

				const totalPages = Math.ceil(count / limit);

				const pagination = {
					path: '/unidade',
					page,
					prev_page: page - 1 >= 1 ? page - 1 : false,
					next_page: Number(page) + Number(1) > totalPages ? false : Number(page) + Number(1),
					totalPages,
					totalItems: count
				};
				res.status(200).json({ entities, pagination });
			} else {
				const { count, rows: entities } = await Entity.findAndCountAll({
					where: whereCondition,
					order: [['id', 'ASC']],
				});

				const totalPages = Math.ceil(count / limit);

				const pagination = {
					path: '/unidade',
					totalItems: count
				};
				res.status(200).json({ entities, pagination });
			}

		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		try {
			const { nome, ativo_unidade, sinc } = req.body;

			const createdEntity = await Entity.create({
				nome,
				ativo_unidade,
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
			const { id } = req.params;
			const { nome, ativo_unidade, sinc } = req.body;

			const [updatedRows] = await Entity.update(
				{
					nome,
					ativo_unidade,
					sinc
				},
				{ where: { id } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(400).send({
					message: `Unidade ${id} not found!`
				});
			}
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
			return res.status(500).send({ message: `${error}` });
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
					message: `Unidade ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error}` });
		}
	};
}

export default UnidadeController;
