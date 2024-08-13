import Entity from '../models/Veiculo.js';
import QRCode from '../models/QRCode.js';
import { BOOLEAN, Op, where } from 'sequelize';
import { Sequelize } from 'sequelize';

import { Efetivo, Graduacao } from '../models/associations.js';

class VeiculoController {

	static getAllEntities = async (req, res) => {
		const { page = 1, qrcode, tipo, renavam, ativo, inativo, cor_veiculo, placa, modelo, marca, militar, efetivo } = req.query;
		const limit = 15;
		let whereClause = {};
		let includeConditions = [];
		try {

			if (qrcode) {
				whereClause.qrcode = { [Op.like]: `%${qrcode}%` };
			}
			if (tipo) {
				whereClause.tipo = { [Op.like]: `%${tipo}%` };
			}

			if (renavam) {
				whereClause.renavam = { [Op.like]: `%${renavam}%` };
			}

			if (ativo) {
				whereClause.ativo_veiculo = { [Op.like]: true} ;
			} 

			if (inativo) {
				whereClause.ativo_veiculo = { [Op.like]: false} ;
			}

			if (cor_veiculo) {
				whereClause.cor_veiculo = { [Op.like]: `%${cor_veiculo}%` };
			}
			if (placa) {
				whereClause.placa = { [Op.like]: `%${placa}%` };
			}
			if (modelo) {
				whereClause.modelo = { [Op.like]: `%${modelo}%` };
			}

			if (marca) {
				whereClause.marca = { [Op.like]: `%${marca}%` };
			}

			if (efetivo) {
				whereClause = {
					...whereClause,
					[Op.and]: [
						...(whereClause[Op.and] || []),
						{
							id_efetivo: { [Op.like]: `%${efetivo}%` }
						}
					]
				};
			}


			includeConditions.push({
				model: Efetivo,
				required: true,
				include: [
					{
						model: Graduacao,
						attributes: ['sigla'],
						required: true
					}
				],
				attributes: ['id', 'id_graduacao', 'nome_completo', 'nome_guerra']
			});


			let entities;

			console.log(whereClause)
			if (militar) {
				entities = await Entity.findAll({
					include: includeConditions,
					where: {
						...whereClause,
						'$Efetivo.nome_guerra$': { [Sequelize.Op.like]: `%${militar}%` }
					},
					order: [['id', 'ASC']],
					offset: Number(page * limit - limit),
					limit: limit,
					distinct: true
				});

				if (entities.length === 0) {
					entities = await Entity.findAll({
						include: includeConditions,
						where: {
							...whereClause,
							'$Efetivo.Graduacao.sigla$': { [Sequelize.Op.like]: `%${militar}%` }
						},
						order: [['id', 'ASC']],
						offset: Number(page * limit - limit),
						limit: limit,
						distinct: true
					});
				}
			} else {
				entities = await Entity.findAll({
					include: includeConditions,
					where: whereClause,
					order: [['id', 'ASC']],
					offset: Number(page * limit - limit),
					limit: limit,
					distinct: true
				});
			}

			const count = await Entity.count({
				include: includeConditions,
				where: whereClause,
				distinct: true
			});

			const totalPages = Math.ceil(count / limit);

			const formattedEntities = entities.map(entity => ({
				id: entity.id,
				id_efetivo: entity.id_efetivo,
				qrcode: entity.qrcode,
				tipo: entity.tipo,
				cor_veiculo: entity.cor_veiculo,
				placa: entity.placa,
				modelo: entity.modelo,
				marca: entity.marca,
				renavam: entity.renavam,
				ativo_veiculo: entity.ativo_veiculo,
				nome_guerra: entity.Efetivo ? entity.Efetivo.nome_guerra : null,
				graduacao: entity.Efetivo && entity.Efetivo.Graduacao ? entity.Efetivo.Graduacao.sigla : null,
			}));

			const pagination = {
				path: '/veiculo',
				page: Number(page),
				prev_page: page > 1 ? Number(page) - 1 : false,
				next_page: Number(page) < totalPages ? Number(page) + 1 : false,
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
				return res.status(404).send({
					message: `Veiculo ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error.message}` });
		}
	};

	static createEntity = async (req, res) => {
		let qrCode;
		try {
			let {
				id_efetivo,
				qrcode,
				tipo,
				cor_veiculo,
				placa,
				modelo,
				marca,
				renavam,
				ativo_veiculo,
				sinc_veiculo
			} = req.body;

			const existingEntity = await Entity.findOne({ where: { qrcode: qrcode } });
			if (existingEntity) {
				return res.status(400).send({ message: 'Já existe um veículo cadastrado com este Selo/An!' });
			} else {
				qrCode = await QRCode.findOne({ where: { qrcode: qrcode } });
				if (!qrCode) {
					const newQrCode = await QRCode.create({ qrcode: qrcode, nivel_acesso: 1 });
					qrcode = newQrCode.qrcode;
				}
			}

			const createdEntity = await Entity.create({
				id_efetivo,
				qrcode,
				tipo,
				cor_veiculo,
				placa,
				modelo,
				marca,
				renavam,
				ativo_veiculo,
				sinc_veiculo
			});

			return res.status(201).json(createdEntity);
		} catch (error) {
			if (qrCode) {
				await qrCode.destroy();
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
					message: `Nenhum campo foi alterado.`
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
