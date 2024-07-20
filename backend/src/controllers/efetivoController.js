import Entity from '../models/Efetivo.js';
import { Sequelize } from 'sequelize';
import verifyPassword from '../util/verifyPassword.js';
import NoEntityError from '../util/customErrors/NoEntityError.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Graduacao from '../models/Graduacao.js';
import Unidade from '../models/Unidade.js';
import Alerta from '../models/Alerta.js';

class EfetivoController {

	static getAllEntities = async (req, res) => {
		const { page = 1, qrcode_efetivo, nome_guerra, nome_completo, unidade, graduacao } = req.query;
		const limit = 10;
		let whereCondition = {};
		let includeConditions = [{
			model: Alerta,
			attributes: ['nome_alerta'],
			required: false,
			as: 'Alerta'
		  }];
	
		try {
		  if (qrcode_efetivo) {
			whereCondition.qrcode_efetivo = { [Sequelize.Op.like]: `%${qrcode_efetivo}%` };
		  }
	
		  if (nome_guerra) {
			whereCondition.nome_guerra = { [Sequelize.Op.like]: `%${nome_guerra}%` };
		  }
	
		  if (nome_completo) {
			whereCondition.nome_completo = { [Sequelize.Op.like]: `%${nome_completo}%` };
		  }
	
		  if (unidade) {
			includeConditions.push({
			  model: Unidade,
			  where: {
				nome: { [Sequelize.Op.like]: `%${unidade}%` }
			  },
			  attributes: ['nome'],
			  required: true
			});
		  } else {
			includeConditions.push({
			  model: Unidade,
			  attributes: ['nome'],
			});
		  }
	
		  if (graduacao) {
			includeConditions.push({
			  model: Graduacao,
			  where: {
				sigla: { [Sequelize.Op.like]: `%${graduacao}%` }
			  },
			  attributes: ['sigla'],
			  required: true
			});
		  } else {
			includeConditions.push({
			  model: Graduacao,
			  attributes: ['sigla'],
			});
		  }

	
		  const { count, rows: entities } = await Entity.findAndCountAll({
			where: whereCondition,
			include: includeConditions,
			order: [['id', 'ASC']],
			offset: Number(page * limit - limit),
			limit: limit
		  });

		  console.log(whereCondition)
	
		  const totalPages = Math.ceil(count / limit);
	
		  const formattedEntities = entities.map(entity => ({
			id: entity.id,
			nome_completo: entity.nome_completo,
			nome_guerra: entity.nome_guerra,
			qrcode_efetivo: entity.qrcode_efetivo,
			email: entity.email,
			cnh: entity.cnh,
			val_cnh: entity.val_cnh,
			nivel_acesso: entity.nivel_acesso,
			ativo_efetivo: entity.ativo_efetivo,
			sinc_efetivo: entity.sinc_efetivo,
			alerta: entity.Alerta ? entity.Alerta.nome_alerta : null,
			unidade: entity.Unidade ? entity.Unidade.nome : null,
			graduacao: entity.Graduacao ? entity.Graduacao.sigla : null,
		  }));
	
		  const pagination = {
			path: '/efetivo',
			page: Number(page),
			prev_page: page > 1 ? Number(page) - 1 : false,
			next_page: Number(page) < totalPages ? Number(page) + 1 : false,
			totalPages,
			totalItems: count
		  };
	
		  res.status(200).json({ entities: formattedEntities, pagination });
		} catch (error) {
		  res.status(500).send({ message: `${error.message}` });
		}
	  };

	static getEntityById = async (req, res) => {
		try {
			const entity = await Entity.findByPk(req.params.id);

			if (entity) {
				delete entity.dataValues.senha;
				return res.status(200).json(entity);
			} else {
				return res.status(404).send({
					message: `Entity with id ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static getEntityBySaram = async (req, res) => {
		try {
			const { qrcode_efetivo } = req.body

			let whereCondition = {}
			if (qrcode_efetivo) {
				whereCondition.qrcode_efetivo = { [Op.like]: `%${qrcode_efetivo}%` };
			}
			const entity = await Entity.findAll({
				where: whereCondition,
			});

			if (entity) {
				return res.status(200).json(entity);
			} else {
				return res.status(404).send({
					message: `Entity with id ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		try {
			const {
				id_graduacao,
				nome_completo,
				nome_guerra,
				foto,
				dependente,
				id_alerta,
				id_unidade,
				qrcode_efetivo,
				email,
				cnh,
				val_cnh,
				nivel_acesso,
				ativo_efetivo,
				sinc_efetivo
			} = req.body;

			const createdEntity = await Entity.create({
				id_graduacao,
				nome_completo,
				nome_guerra,
				foto,
				dependente,
				id_alerta,
				id_unidade,
				qrcode_efetivo,
				email,
				cnh,
				val_cnh,
				nivel_acesso,
				ativo_efetivo,
				sinc_efetivo
			});

			res.status(201).json(createdEntity);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {

				return res.status(400).send({ message: 'Valores já cadastrados!' });
			} else {

				return res.status(500).send({ message: `${error.message}` });
			}
		}
	};

	static updateEntity = async (req, res) => {
		try {
			const {
				id_graduacao,
				nome_completo,
				nome_guerra,
				foto,
				dependente,
				id_alerta,
				id_unidade,
				qrcode_efetivo,
				email,
				cnh,
				val_cnh,
				nivel_acesso,
				ativo_efetivo,
				sinc_efetivo
			} = req.body;
			const entityId = req.params.id;

			const [updatedRows] = await Entity.update(
				{
					id_graduacao,
					nome_completo,
					nome_guerra,
					foto,
					dependente,
					id_alerta,
					id_unidade,
					qrcode_efetivo,
					email,
					cnh,
					val_cnh,
					nivel_acesso,
					ativo_efetivo,
					sinc_efetivo
				},
				{ where: { id: entityId } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(404).send({
					message: `Entity with id ${entityId} not found!`
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
					message: `Entity with id ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static login = async (req, res) => {
		const { cpf, senha } = req.body;
		try {
			const entity = await Entity.findOne({ where: { cpf } });

			const isPasswordValid = await verifyPassword(entity, senha);

			if (!isPasswordValid) {
				return res.status(401).json({ unauthorized: 'Credenciais inválidas' });
			}

			const jwtToken = jwt.sign({ id: entity.id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

			delete entity.dataValues.senha;

			return res.status(200).send({ jwtToken, entity });
		} catch (error) {
			if (error instanceof NoEntityError) {
				return res.status(400).send({ mensagem: 'Entidade não encontrada!' });
			}
			res.status(500).json({ error: error.message });
		}
	};
}

export default EfetivoController;
