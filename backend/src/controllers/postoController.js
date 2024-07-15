import { where, Op } from 'sequelize';
import Entity from '../models/Posto.js';
import Alerta from '../models/Alerta.js';

class PostoController {
	static getAllEntities = async (req, res) => {
		const { page = 1, nome, nivel_acesso } = req.query;
		const limit = 15;
		let lastPage = 1;

		try {
			let whereCondition = {};
			if (nome) {
				whereCondition.nome = { [Op.like]: `%${nome}%` }
			}
			if (nivel_acesso) {
				whereCondition.nivel_acesso = { [Op.like]: `%${nivel_acesso}%` }
			}

			whereCondition.ativo_posto = { [Op.like]: true }

			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const totalPages = Math.ceil(count / limit);

			const pagination = {
				path: '/posto',
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

	static createEntity = async (req, res) => {
		try {
			const { nome, nivel_acesso, ativo_posto, sinc_posto } = req.body;

			const createdEntity = await Entity.create({
				nome,
				nivel_acesso,
				ativo_posto,
				sinc_posto
			});
			await Alerta.create({
				categoria: "Sucesso",
				mensagem: "Posto de serviço criado com sucesso",
				ativo_alerta: true
			});
			res.status(201).json(createdEntity);
		} catch (error) {
			await Alerta.create({
				categoria: "Erro",
				mensagem: "Erro ao criar um posto de serviço",
				ativo_alerta: true
			});
			if (error.name == 'SequelizeUniqueConstraintError') {
				res.status(400).send({ message: 'Valores já cadastrados!' });
			} else {
				res.status(500).send({ message: `${error.message}` });
			}
		}
	};

	static updateEntity = async (req, res) => {
		try {
			const { nome, nivel_acesso, ativo_posto, sinc_posto } = req.body;
			const entityId = req.params.id;

			const [updatedRows] = await Entity.update(
				{
					nome,
					nivel_acesso,
					ativo_posto,
					sinc_posto
				},
				{ where: { id: entityId } }
			);

			if (updatedRows > 0) {
				if (ativo_posto == false) {
					await Alerta.create({
						categoria: "Sucesso",
						mensagem: "Posto de serviço deletado com sucesso",
						ativo_alerta: true
					});
				} else {
					await Alerta.create({
						categoria: "Sucesso",
						mensagem: "Posto de serviço alterado com sucesso",
						ativo_alerta: true
					});
				}
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(400).send({
					message: `Id ${entityId} not found!`
				});
			}
		} catch (error) {
			const { ativo_posto } = req.body;
			if (ativo_posto == false) {
				await Alerta.create({
					categoria: "Erro",
					mensagem: "Erro ao deletar um posto de serviço",
					ativo_alerta: true
				});
			} else {
				await Alerta.create({
					categoria: "Erro",
					mensagem: "Erro ao editar um posto de serviço",
					ativo_alerta: true
				});
			}
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

export default PostoController;
