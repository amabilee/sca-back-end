import { Op, Sequelize } from 'sequelize';
import Alerta from '../models/Alerta.js';
import Entity from '../models/Unidade.js';
import Efetivos from '../models/Efetivo.js'
import Veiculos from '../models/Veiculo.js'

Entity.hasMany(Efetivos, { foreignKey: 'id_unidade', as: 'efetivos' });
Efetivos.belongsTo(Entity, { foreignKey: 'id_unidade', as: 'unidade' });

Efetivos.hasMany(Veiculos, { foreignKey: 'id_efetivo', as: 'veiculos' });
Veiculos.belongsTo(Efetivos, { foreignKey: 'id_efetivo', as: 'efetivo' });

class UnidadeController {
	static getAllEntities = async (req, res) => {
		const { page = 1, nome, nivel_acesso } = req.query;
		const limit = 15;

		try {
			let whereCondition = {}
			if (nome) {
				whereCondition.nome = { [Op.like]: `%${nome}%` }
			}
			if (nivel_acesso) {
				whereCondition.nivel_acesso = { [Op.like]: `%${nivel_acesso}%` }
			}

			whereCondition.ativo_unidade = { [Op.eq]: true }

			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				include: [
					{
						model: Efetivos,
						as: 'efetivos',
						attributes: []
					},
					{
						model: Efetivos,
						as: 'efetivos',
						include: [
							{
								model: Veiculos,
								as: 'veiculos',
								attributes: []
							}
						]
					}
				],
				attributes: {
					include: [
						[Sequelize.fn('COUNT', Sequelize.col('efetivos.id')), 'efetivoCount'],
						[Sequelize.fn('COUNT', Sequelize.col('efetivos->veiculos.id')), 'veiculoCount']
					]
				},
				group: ['Unidade.id'],
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit,
				subQuery: false,
				distinct: true,
				raw: true
			});
			const totalCount = count.length;

			const totalPages = Math.ceil(totalCount / limit);

			const pagination = {
				path: '/unidade',
				page,
				prev_page: page - 1 >= 1 ? page - 1 : false,
				next_page: Number(page) + Number(1) > totalPages ? false : Number(page) + Number(1),
				totalPages,
				totalItems: totalCount
			};

			res.status(200).json({ entities, pagination });
		} catch (error) {
			res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		try {
			const { nome, ativo_unidade, maximo_efetivo, maximo_veiculo, nivel_acesso, sinc } = req.body;

			const createdEntity = await Entity.create({
				nome,
				ativo_unidade,
				maximo_efetivo,
				maximo_veiculo,
				nivel_acesso,
				sinc
			});

			await Alerta.create({
				categoria: "Sucesso",
				mensagem: "Unidade criada com sucesso",
				ativo_alerta: true
			});

			res.status(201).json(createdEntity);
		} catch (error) {
			await Alerta.create({
				categoria: "Erro",
				mensagem: "Erro ao criar uma unidade",
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
			const { id } = req.params;
			const { nome, ativo_unidade, maximo_efetivo, maximo_veiculo, nivel_acesso, sinc } = req.body;

			const [updatedRows] = await Entity.update(
				{
					nome,
					ativo_unidade,
					maximo_efetivo,
					maximo_veiculo,
					nivel_acesso,
					sinc
				},
				{ where: { id } }
			);

			if (updatedRows > 0) {
				if (ativo_unidade == false) {
					await Alerta.create({
						categoria: "Sucesso",
						mensagem: "Unidade deletada com sucesso",
						ativo_alerta: true
					});
				} else {
					await Alerta.create({
						categoria: "Sucesso",
						mensagem: "Unidade alterada com sucesso",
						ativo_alerta: true
					});
				}
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(400).send({
					message: `Unidade ${id} not found!`
				});
			}
		} catch (error) {
			const { ativo_unidade } = req.body;
			if (ativo_unidade == false) {
				await Alerta.create({
					categoria: "Erro",
					mensagem: "Erro ao deletar uma unidade",
					ativo_alerta: true
				});
			} else {
				await Alerta.create({
					categoria: "Erro",
					mensagem: "Erro ao editar uma unidade",
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
