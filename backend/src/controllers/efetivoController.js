import Entity from '../models/Efetivo.js';
import verifyPassword from '../util/verifyPassword.js';
import bcrypt from 'bcrypt';
import NoEntityError from '../util/customErrors/NoEntityError.js';
import jwt from 'jsonwebtoken';
import QRCode from '../models/QRCode.js';
import Alerta from '../models/Alerta.js';
import { Op } from 'sequelize';

class EfetivoController {

	static getAllEntities = async (req, res) => {
		const { page = 1 } = req.query;
		const limit = 10;

		try {

			const { count, rows: entities } = await Entity.findAndCountAll({
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const totalPages = Math.ceil(count / limit);

			entities.forEach((entity) => {
				delete entity.dataValues.senha;
			});

			const pagination = {
				path: '/efetivo',
				page,
				prev_page: page > 1 ? page - 1 : false,
				next_page: Number(page) + 1 > totalPages ? false : Number(page) + 1,
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

	static createEntity = async (req, res) => {
		try {
			const {
				id_graduacao,
				nome_completo,
				nome_guerra,
				cpf,
				saram,
				foto,
				dependente,
				id_unidade,
				senha,
				nivel_acesso,
				ativo_efetivo,
				sinc_efetivo
			} = req.body;

			const senhaHashed = await bcrypt.hash(senha, 10);

			const createdQRCode = await QRCode.create({
				nivel_acesso,
				entity: 'efetivo'
			});

			const createdAlerta = await Alerta.create({
				nome_alerta: 'criação',
				cor: 'verde',
				ativo_alerta: true
			});

			const createdEntity = await Entity.create({
				id_graduacao,
				nome_completo,
				nome_guerra,
				cpf,
				saram,
				foto,
				dependente,
				id_alerta: createdAlerta.id,
				id_unidade,
				qrcode_efetivo: createdQRCode.qrcode,
				senha: senhaHashed,
				ativo_efetivo,
				sinc_efetivo
			});

			delete createdEntity.dataValues.senha;

			res.status(201).json(createdEntity);
		} catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				if (createdQRCode) await QRCode.destroy({ where: { qrcode: createdQRCode.qrcode } });
				if (createdAlerta) await Alerta.destroy({ where: { id: createdAlerta.id } });

				return res.status(400).send({ message: 'Valores já cadastrados!' });
			} else {
				if (createdQRCode) await QRCode.destroy({ where: { qrcode: createdQRCode.qrcode } });
				if (createdAlerta) await Alerta.destroy({ where: { id: createdAlerta.id } });

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
				cpf,
				saram,
				foto,
				dependente,
				id_alerta,
				id_unidade,
				qrcode_efetivo,
				ativo_efetivo,
				sinc_efetivo
			} = req.body;
			const entityId = req.params.id;

			const [updatedRows] = await Entity.update(
				{
					id_graduacao,
					nome_completo,
					nome_guerra,
					cpf,
					saram,
					foto,
					dependente,
					id_alerta,
					id_unidade,
					qrcode_efetivo,
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
