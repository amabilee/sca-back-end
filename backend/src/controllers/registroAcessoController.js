import Entity from '../models/Registro_Acesso.js';
import { Posto, Dependente, VeiculoSemAn, Cracha, Veiculo, Qrcode, Graduacao, Efetivo } from '../models/associations.js'
import { Op } from 'sequelize';

class RegistroAcessoController {
	static getAllEntities = async (req, res) => {
		const {
			page = 1,
			modalidade,
			tipo,
			placa,
			data,
			sentinela_autorizador,
			id_posto,
			pessoa_militar
		} = req.query;
		const limit = 15;
		let includeConditions = [
			{
				model: Posto,
				attributes: ['nome'],
			},
			{
				model: Dependente,
				attributes: ['cpf', 'nome']
			},
			{
				model: VeiculoSemAn,
				attributes: ['placa']
			},
			{
				model: Veiculo,
				attributes: ['placa', 'qrcode']
			},
			{
				model: Qrcode,
				as: 'EfetivoQrcode',
				include: [
					{
						model: Efetivo,
						as: 'Efetivo',
						include: [
							{
								model: Graduacao,
								attributes: ['sigla'],
							}
						],
						attributes: ['nome_guerra'],
					}
				],
				attributes: ['qrcode'],
			},
			{
				model: Qrcode,
				as: 'SentinelaQrcode',
				include: [
					{
						model: Efetivo,
						as: 'Efetivo',
						include: [
							{
								model: Graduacao,
								attributes: ['sigla'],
							}
						],
						attributes: ['nome_guerra'],
					}
				],
				attributes: ['qrcode'],
			}
		];

		let whereCondition = []

		if (modalidade === 'veiculo') {
			whereCondition = {
				...whereCondition,
				[Op.and]: [
					...(whereCondition[Op.and] || []),
					{
						[Op.or]: [
							{ id_veiculo: { [Op.not]: null } },
							{ id_veiculo_sem_an: { [Op.not]: null } }
						]
					}
				]
			};
		}

		if (sentinela_autorizador) {
			whereCondition = {
				...whereCondition,
				[Op.and]: [
					...(whereCondition[Op.and] || []),
					{
						[Op.or]: [
							{ '$SentinelaQrcode.Efetivo.nome_guerra$': { [Op.like]: `%${sentinela_autorizador}%` } },
							{ '$SentinelaQrcode.Efetivo.Graduacao.sigla$': { [Op.like]: `%${sentinela_autorizador}%` } },
							{ autorizador: { [Op.like]: `%${sentinela_autorizador}%` } }
						]
					}
				]
			};
		}

		if (data) {
			const [startDateTime, endDateTime] = data.split(',');
			const startDate = new Date(startDateTime.replace(/%20/g, ' '));
			const endDate = new Date(endDateTime.replace(/%20/g, ' '));

			if (!isNaN(startDate) && !isNaN(endDate)) {
				whereCondition = {
					...whereCondition,
					[Op.and]: [
						...(whereCondition[Op.and] || []),
						{
							[Op.and]: [
								{
									data: {
										[Op.between]: [
											startDate.toISOString().split('T')[0],
											endDate.toISOString().split('T')[0],
										],
									},
								},
								{
									hora: {
										[Op.between]: [
											startDate.toTimeString().split(' ')[0],
											endDate.toTimeString().split(' ')[0],
										],
									},
								},
							],
						},
					],
				};
			}
		}

		if (tipo) {
			whereCondition = {
				...whereCondition,
				[Op.and]: [
					...(whereCondition[Op.and] || []),
					{
						tipo: { [Op.like]: `%${tipo}%` }
					}
				]
			};
		}

		if (id_posto) {
			whereCondition = {
				...whereCondition,
				[Op.and]: [
					...(whereCondition[Op.and] || []),
					{
						id_posto: { [Op.like]: `%${id_posto}%` }
					}
				]
			};
		}

		if (placa) {
			whereCondition = {
				...whereCondition,
				[Op.and]: [
					...(whereCondition[Op.and] || []),
					{
						[Op.or]: [
							{ '$VeiculoSemAn.placa$': { [Op.like]: `%${placa}%` } },
							{ '$Veiculo.placa$': { [Op.like]: `%${placa}%` } },
						]
					}
				]
			};
		}

		if (pessoa_militar) {
			whereCondition = {
				...whereCondition,
				[Op.and]: [
					...(whereCondition[Op.and] || []),
					{
						[Op.or]: [
							{ '$Dependente.nome$': { [Op.like]: `%${pessoa_militar}%` } },
							{ '$Dependente.cpf$': { [Op.like]: `%${pessoa_militar}%` } },
							{ '$EfetivoQrcode.Efetivo.Graduacao.sigla$': { [Op.like]: `%${pessoa_militar}%` } },
							{ '$EfetivoQrcode.Efetivo.nome_guerra$': { [Op.like]: `%${pessoa_militar}%` } },
						]
					}
				]
			};
		}


		try {
			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				include: includeConditions,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const totalPages = Math.ceil(count / limit);

			const pagination = {
				path: '/registro_acesso',
				page,
				prev_page: page - 1 >= 1 ? page - 1 : false,
				next_page: Number(page) + Number(1) > totalPages ? false : Number(page) + Number(1),
				totalPages,
				totalItems: count
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
			return res.status(500).send({ message: `${error}` });
		}
	};

	static createEntity = async (req, res) => {
		try {
			const {
				tipo,
				data,
				hora,

				posto,
				// id_posto,

				qrcode,

				// cracha_pessoa
				cracha_pessoa_numero,

				// cracha_veiculo,
				cracha_veiculo_numero,

				id_visitante,

				cpf_dependente,
				// id_dependente,

				id_veiculo,

				placa_veiculo_sem_an,
				// id_veiculo_sem_an,
				autorizador,
				sentinela,
				sinc_acesso,
				device,
				detalhe
			} = req.body;

			let id_postoCollected
			const postoInfo = await Posto.findOne({ where: { nivel_acesso: posto } })
			if (postoInfo) {
				id_postoCollected = postoInfo.dataValues.id
			} else {
				return res.status(400).send({ message: 'Não foi encontrado um posto com este nível de acesso!' });
			}

			let id_dependenteCollected
			if (cpf_dependente) {
				const dependenteInfo = await Dependente.findOne({ where: { cpf: cpf_dependente } })
				if (dependenteInfo) {
					id_dependenteCollected = dependenteInfo.dataValues.id
				} else {
					return res.status(400).send({ message: 'Não foi encontrado um dependente com este CPF!' });
				}
			}

			let id_veiculo_sem_anCollected
			if (placa_veiculo_sem_an) {

				const veiculoSemAnInfo = await VeiculoSemAn.findOne({ where: { placa: placa_veiculo_sem_an } })
				if (veiculoSemAnInfo) {
					id_veiculo_sem_anCollected = veiculoSemAnInfo.dataValues.id
				} else {
					return res.status(400).send({ message: 'Não foi encontrado um veículo sem An com esta placa!' });
				}

				const cracha_veiculoInfo = await Cracha.findOne({ where: { numero_cracha: cracha_veiculo_numero, veiculo: 1 } })
				if (!cracha_veiculoInfo) {
					await Cracha.create({
						numero_cracha: cracha_veiculo_numero,
						pessoa: 0,
						veiculo: 1
					})
				}
			}

			if (cpf_dependente || id_visitante) {
				const cracha_pessoaInfo = await Cracha.findOne({ where: { numero_cracha: cracha_pessoa_numero, pessoa: 1 } })
				if (!cracha_pessoaInfo) {
					await Cracha.create({
						numero_cracha: cracha_pessoa_numero,
						pessoa: 1,
						veiculo: 0
					})
				}
			}



			const createdEntity = await Entity.create({
				tipo,
				data,
				hora,
				id_posto: id_postoCollected,

				qrcode,
				cracha_pessoa: cracha_pessoa_numero ? cracha_pessoa_numero : null,
				cracha_veiculo: cracha_veiculo_numero ? cracha_veiculo_numero : null,
				id_visitante,
				id_dependente: id_dependenteCollected ? id_dependenteCollected : null,
				id_veiculo,
				id_veiculo_sem_an: id_veiculo_sem_anCollected ? id_veiculo_sem_anCollected : null,
				autorizador,
				sentinela,

				sinc_acesso,
				device,
				detalhe
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
			const {
				tipo,
				data,
				hora,
				id_posto,
				qrcode,
				id_efetivo,
				id_visitante,
				id_dependente,
				id_veiculo,
				autorizador,
				sinc_acesso
			} = req.body;

			const [updatedRows] = await Entity.update(
				{
					tipo,
					data,
					hora,
					id_posto,
					qrcode,
					id_efetivo,
					id_visitante,
					id_dependente,
					id_veiculo,
					autorizador,
					sinc_acesso
				},
				{ where: { id } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(400).send({
					message: `Registro de Acesso ${id} not found!`
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
					message: `Registro de Acesso ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error}` });
		}
	};
}

export default RegistroAcessoController;