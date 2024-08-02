import Entity from '../models/Dependente.js';
import { Op } from 'sequelize';

import { Efetivo, Graduacao } from '../models/associations.js';

class DependenteController {
	static getAllEntities = async (req, res) => {

		const { page = 1, cpf } = req.query;
		const limit = 15;
		let lastPage = 1;
		let whereCondition = {};
		let includeConditions = [{
			model: Efetivo,
			required: true,
			include: [
			  {
				model: Graduacao,
				attributes: ['sigla'],
				required: true
			  }
			],
			attributes: ['id', 'id_graduacao', 'qrcode_efetivo', 'nome_guerra']
		  }];

		try {
			if (cpf) {
				whereCondition.cpf = { [Op.eq]: `${cpf}` }
			}

			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				include: includeConditions,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const formattedEntities = entities.map(entity => ({
				id: entity.id,
				id_efetivo: entity.id_efetivo,
				cpf: entity.cpf,
				nome: entity.nome,
				parentesco: entity.parentesco,
				cracha: entity.cracha,
				ativo_dependente: entity.ativo_dependente,
				sinc_dependente: entity.sinc_dependente,
				nome_guerra: entity.Efetivo ? entity.Efetivo.nome_guerra : null,
				graduacao: entity.Efetivo && entity.Efetivo.Graduacao ? entity.Efetivo.Graduacao.sigla : null,
				numero_ordem: entity.Efetivo ? entity.Efetivo.qrcode_efetivo : null
			  }));

			const totalPages = Math.ceil(count / limit);

			const pagination = {
				path: '/dependente',
				page,
				prev_page: page - 1 >= 1 ? page - 1 : false,
				next_page: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
				totalPages,
				totalItems: count
			};
			res.status(200).json({ formattedEntities, pagination });
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
			const {
				id_efetivo,
				cpf,
				nome,
				parentesco,
				ativo_dependente,
				sinc_dependente
			} = req.body;

			const existingEntity = await Entity.findOne({ where: { cpf } });
			if (existingEntity) {
				console.log(existingEntity.dataValues)
				return res.status(400).send({ message: 'Já existe um dependente cadastrado com este CPF!' });
			}

			const createdEntity = await Entity.create({
				id_efetivo,
				cpf,
				nome,
				parentesco,
				ativo_dependente,
				sinc_dependente
			});
			return res.status(201).json(createdEntity);
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static updateEntity = async (req, res) => {
		try {
			const { id_efetivo, nome, parentesco, cpf, ativo_dependente, sinc_dependente } = req.body;
			const entityId = req.params.id;

			const [updatedRows] = await Entity.update(
				{
					id_efetivo,
					nome,
					parentesco,
					cpf,
					ativo_dependente,
					sinc_dependente
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

export default DependenteController;
