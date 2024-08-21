import Entity from '../models/Efetivo.js';
import { Sequelize } from 'sequelize';
import verifyPassword from '../util/verifyPassword.js';
import NoEntityError from '../util/customErrors/NoEntityError.js';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Graduacao from '../models/Graduacao.js';
import Unidade from '../models/Unidade.js';
import Alerta from '../models/Alerta.js';
import QRCode from '../models/QRCode.js'
import Foto from '../models/Foto.js';

import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('foto');

class EfetivoController {

	static getEntityBySaram = async (req, res) => {
		try {
			let whereCondition = {};
			whereCondition.qrcode_efetivo = { [Op.like]: `%${req.params.id}%` };

			const entity = await Entity.findAll({
				where: whereCondition,
				include: [
					{
						model: Foto,
						attributes: ['foto'],
						required: false
					},
					{
						model: Graduacao,
						attributes: ['sigla']
					},
					{
						model: Unidade,
						attributes: ['nome']
					}
				]
			});

			if (entity) {
				const result = entity.map(e => {
					const eJson = e.toJSON();
					if (eJson.fotos && eJson.fotos.length > 0) {
						eJson.foto = eJson.fotos[0].foto.toString('base64');
					} else {
						eJson.foto = null;
					}
					delete eJson.fotos;
					return eJson;
				});

				return res.status(200).json(result);
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
		const {
			id_graduacao,
			nome_completo,
			nome_guerra,
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

		const foto = req.file?.buffer;

		try {
			const existingEntity = await Entity.findOne({ where: { qrcode_efetivo: qrcode_efetivo } });
			if (existingEntity) {
				if (!existingEntity.dataValues.ativo_efetivo) {
					return res.status(400).send({ message: 'Efetivo desativado, entre em contato com os desenvolvedores.' });
				} else {
					return res.status(400).send({ message: 'Efetivo já cadastrado com este QR code.' });
				}
			} else {
				let qrCode = await QRCode.findOne({ where: { qrcode: qrcode_efetivo } });
				if (!qrCode) {
					qrCode = await QRCode.create({ qrcode: qrcode_efetivo, nivel_acesso: nivel_acesso || 1 });
				}
			}

			let createdEntity
			if (val_cnh == null || cnh == null || cnh == 0) {
				createdEntity = await Entity.create({
					id_graduacao,
					nome_completo,
					nome_guerra,
					dependente,
					id_alerta,
					id_unidade,
					qrcode_efetivo,
					email,
					nivel_acesso,
					ativo_efetivo,
					sinc_efetivo
				});
			} else {
				createdEntity = await Entity.create({
					id_graduacao,
					nome_completo,
					nome_guerra,
					dependente,
					id_alerta,
					id_unidade,
					qrcode_efetivo,
					email,
					cnh: cnh != 0 ? cnh : null,
					val_cnh: val_cnh != null ? val_cnh : null,
					nivel_acesso,
					ativo_efetivo,
					sinc_efetivo
				});
			}



			if (foto) {
				await Foto.create({
					id_efetivo: createdEntity.id,
					foto: foto,
					ativo_foto: true,
					sinc_foto: Date.now()
				});
			}

			res.status(201).json(createdEntity);
		} catch (error) {
			await QRCode.destroy({ where: { qrcode: qrcode_efetivo } });
			if (error.name === 'SequelizeUniqueConstraintError') {
				return res.status(400).send({ message: 'Valores já cadastrados!' });
			} else {
				return res.status(500).send({ message: `${error.message}` });
			}
		}
	};

	static getAllEntities = async (req, res) => {
		const { page = 1, qrcode_efetivo, nome_guerra, nome_completo, unidade, graduacao } = req.query;
		const limit = 15;
		let whereCondition = {};
		let includeConditions = [
			{
				model: Alerta,
				attributes: ['nome_alerta'],
				required: false,
				as: 'Alerta'
			},
			{
				model: Foto,
				attributes: ['foto'],
				required: false
			},
		];

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

			whereCondition.ativo_efetivo = { [Op.like]: true };

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

			const totalPages = Math.ceil(count / limit);

			const formattedEntities = entities.map(entity => {
				const entityJson = entity.toJSON();

				return {
					id: entityJson.id,
					nome_completo: entityJson.nome_completo,
					nome_guerra: entityJson.nome_guerra,
					qrcode_efetivo: entityJson.qrcode_efetivo,
					email: entityJson.email,
					cnh: entityJson.cnh,
					val_cnh: entityJson.val_cnh,
					nivel_acesso: entityJson.nivel_acesso,
					ativo_efetivo: entityJson.ativo_efetivo,
					sinc_efetivo: entityJson.sinc_efetivo,
					alerta: entityJson.Alerta ? entityJson.Alerta.nome_alerta : null,
					unidade: entityJson.Unidade ? entityJson.Unidade.nome : null,
					graduacao: entityJson.Graduacao ? entityJson.Graduacao.sigla : null,
					id_alerta: entityJson.id_alerta,
					id_unidade: entityJson.id_unidade,
					id_graduacao: entityJson.id_graduacao
				};
			});

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
			const entity = await Entity.findOne({
				where: { id: req.params.id },
				include: [
					{
						model: Graduacao,
						attributes: ['sigla']
					},
					{
						model: Foto,
						attributes: ['foto'],
						required: false
					}
				]
			});

			if (entity) {
				const entityJson = entity.toJSON();

				if (entityJson.Fotos && entityJson.Fotos.length > 0) {
					entityJson.foto = entityJson.Fotos[0].foto;
				} else {
					entityJson.foto = null;
				}

				delete entityJson.Fotos;

				// Format the entity
				const formattedEntity = {
					id: entityJson.id,
					foto: entityJson.foto,
					nome_completo: entityJson.nome_completo,
					nome_guerra: entityJson.nome_guerra,
					qrcode_efetivo: entityJson.qrcode_efetivo,
					email: entityJson.email,
					cnh: entityJson.cnh,
					val_cnh: entityJson.val_cnh,
					nivel_acesso: entityJson.nivel_acesso,
					ativo_efetivo: entityJson.ativo_efetivo,
					sinc_efetivo: entityJson.sinc_efetivo,
					id_alerta: entityJson.id_alerta,
					id_unidade: entityJson.id_unidade,
					id_graduacao: entityJson.id_graduacao,
					graduacao: entityJson.Graduacao.sigla
				};

				return res.status(200).json(formattedEntity); // Return the formatted entity
			} else {
				return res.status(404).send({
					message: `Entity with id ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};


	static updateEntity = async (req, res) => {
		upload(req, res, async (err) => {
			if (err instanceof multer.MulterError) {
				return res.status(500).send({ message: `Multer error: ${err.message}` });
			} else if (err) {
				return res.status(500).send({ message: `Error: ${err.message}` });
			}

			try {
				const {
					id_graduacao,
					nome_completo,
					nome_guerra,
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

				let fotoBuffer = req.file ? req.file.buffer : null;

				const entity = await Entity.findByPk(entityId, {
					include: {
						model: Foto,
						attributes: ['foto']
					}
				});

				if (!entity) {
					return res.status(404).send({ message: `Entity with id ${entityId} not found!` });
				}

				// Verificar se a foto foi alterada
				if (fotoBuffer) {
					const existingFoto = await Foto.findOne({ where: { id_efetivo: entityId, foto: fotoBuffer } });

					if (!existingFoto) {
						// Remover a foto antiga se existir
						if (entity.Fotos && entity.Fotos.length > 0) {
							await Foto.destroy({ where: { id_efetivo: entityId } });
						}
						// Adicionar a nova foto
						await Foto.create({ id_efetivo: entityId, foto: fotoBuffer });
					}
				}

				const [updatedRows] = await Entity.update(
					{
						id_graduacao,
						nome_completo,
						nome_guerra,
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

				if (updatedRows > 0 || fotoBuffer) {
					res.status(200).send({ message: 'Entity updated successfully' });
				} else {
					res.status(404).send({
						message: `Não foram feitas alterações!`
					});
				}
			} catch (error) {
				res.status(500).send({ message: `${error.message}` });
			}
		});
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

			const jwtToken = jwt.sign({ id: entity.id }, process.env.JWT_SECRET_KEY, { expiresIn: '12h' });

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
