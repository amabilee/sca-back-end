import Entity from '../models/Visitante.js';
import { Op } from 'sequelize';

import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('foto');

class VisitanteController {
	static getAllEntities = async (req, res) => {
		const { page = 1, cpf } = req.query;
		const limit = 15;
		let lastPage = 1;

		let whereCondition = {};

		try {

			if (cpf) {
				whereCondition.cpf = { [Op.like]: `${cpf}` }
			}

			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			if (!cpf) {
				entities.forEach((entity) => {
					delete entity.dataValues.foto;
				});
			}

			const totalPages = Math.ceil(count / limit);

			const pagination = {
				path: '/visitante',
				page,
				prev_page: page - 1 >= 1 ? page - 1 : false,
				next_page: Number(page) + Number(1) > lastPage ? false : Number(page) + Number(1),
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
				cpf,
				nome,
				rua,
				numero,
				bairro,
				estado,
				complemento,
				telefone,
				empresa,
				cracha,
				ativo_visitante,
				sinc
			} = req.body;

			const foto = req.file?.buffer;

			const existingEntity = await Entity.findOne({ where: { cpf } });
			if (existingEntity) {
				console.log(existingEntity.dataValues)
				return res.status(400).send({ message: 'Já existe um visitante cadastrado com este CPF!' });
			}

			const createdEntity = await Entity.create({
				cpf,
				nome,
				rua,
				numero,
				bairro,
				estado,
				complemento,
				telefone,
				foto,
				empresa,
				cracha,
				ativo_visitante,
				sinc
			});

			res.status(201).json(createdEntity);
		} catch (error) {

			res.status(500).send({ message: `${error.message}` });
		}
	};


	static updateEntity = async (req, res) => {
		try {
			const { id } = req.params;
			const {
				cpf,
				nome,
				rua,
				numero,
				bairro,
				estado,
				complemento,
				telefone,
				// foto,
				empresa,
				cracha,
				ativo_visitante,
				sinc
			} = req.body;

			const [updatedRows] = await Entity.update(
				{
					cpf,
					nome,
					rua,
					numero,
					bairro,
					estado,
					complemento,
					telefone,
					// foto,
					empresa,
					cracha,
					ativo_visitante,
					sinc
				},
				{ where: { id } }
			);

			if (updatedRows > 0) {
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(400).send({
					message: `Não teve alterações!`
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
					message: `Entity ${req.params.id} not found!`
				});
			}
		} catch (error) {
			return res.status(500).send({ message: `${error}` });
		}
	};
}

export default VisitanteController;
