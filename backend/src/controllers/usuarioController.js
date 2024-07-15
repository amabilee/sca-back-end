import Entity from '../models/Usuario.js';
import Alerta from '../models/Alerta.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import verifyPassword from '../util/verifyPassword.js';
import NoEntityError from '../util/customErrors/NoEntityError.js';

class UserController {

	static getAllEntities = async (req, res) => {
		const { page = 1, nome, cpf, nivel_acesso, modulos } = req.query;
		const limit = 10;
		let lastPage = 1;
		try {
			let whereCondition = {}
			if (nome) {
				whereCondition.nome = { [Op.like]: `%${nome}%` }
			}
			if (cpf) {
				whereCondition.cpf = { [Op.like]: `%${cpf}%` }
			}
			if (nivel_acesso) {
				whereCondition.nivel_acesso = { [Op.like]: `%${nivel_acesso}%` }
			}
			if (modulos) {
				whereCondition.modulos = { [Op.like]: `%${modulos}%` }
			}

			whereCondition.ativo_usuario = { [Op.like]: true }

			const { count, rows: entities } = await Entity.findAndCountAll({
				where: whereCondition,
				order: [['id', 'ASC']],
				offset: Number(page * limit - limit),
				limit: limit
			});

			const totalPages = Math.ceil(count / limit);

			entities.forEach((entity) => {
				delete entity.dataValues.senha;
			});

			const pagination = {
				path: '/usuario',
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
		  const { nome, cpf, usuario, senha, nivel_acesso, modulos, ativo_usuario } = req.body;
		  const senhaHashed = await bcrypt.hash(senha, 10);
	  
		  const createdEntity = await Entity.create({
			nome,
			cpf,
			usuario,
			senha: senhaHashed,
			nivel_acesso,
			modulos,
			ativo_usuario
		  });
	  
		  await Alerta.create({
			categoria: "Sucesso",
			mensagem: "Usuário criado com sucesso",
			ativo_alerta: true
		  });
	  
		  delete createdEntity.dataValues.senha;
	  
		  res.status(201).send({
			usuario: createdEntity
		  });
		} catch (error) {
		  await Alerta.create({
			categoria: "Erro",
			mensagem: "Erro ao criar um usuário",
			ativo_alerta: true
		  });
	  
		  if (error.name === 'SequelizeUniqueConstraintError') {
			res.status(400).send({ message: 'Valores já cadastrados!' });
		  } else {
			res.status(500).send({ message: `${error.message}` });
		  }
		}
	  };

	static updateEntity = async (req, res) => {
		try {
			const { nome, cpf, usuario, nivel_acesso, ativo_usuario, modulos } = req.body;
			const entityId = req.params.id;

			const usuarioAlreadyExist = await Entity.findOne({
				where: {
					usuario,
					id: { [Op.not]: entityId } 
				}
			});

			if (usuarioAlreadyExist) {
				return res.status(400).send({message: `Já existe um perfil com este usuário.`});
			}

			const [updatedRows] = await Entity.update(
				{
					nome,
					cpf,
					usuario,
					nivel_acesso,
					ativo_usuario,
					modulos
				},
				{ where: { id: entityId } }
			);

			if (updatedRows > 0) {
				if (ativo_usuario == false){
					await Alerta.create({
						categoria: "Sucesso",
						mensagem: "Usuário deletado com sucesso",
						ativo_alerta: true
					  });
				} else {
					await Alerta.create({
						categoria: "Sucesso",
						mensagem: "Usuário alterado com sucesso",
						ativo_alerta: true
					  });
				}
				res.status(200).send({ message: 'Entity updated successfully' });
			} else {
				res.status(404).send({
					message: `Id ${entityId} not found!`
				});
			}
		} catch (error) {
			const { ativo_usuario } = req.body;
			if (ativo_usuario == false){
				await Alerta.create({
					categoria: "Erro",
					mensagem: "Erro ao deletar um usuário",
					ativo_alerta: true
				  });
			} else {
				await Alerta.create({
					categoria: "Erro",
					mensagem: "Erro ao editar um usuário",
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
				delete entity.dataValues.senha;
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

	static login = async (req, res) => {
		const { usuario, senha } = req.body;
		try {
			const entity = await Entity.findOne({ where: { usuario } });

			const isPasswordValid = await verifyPassword(entity, senha);

			// if (!isPasswordValid) {
			// 	return res.status(401).json({ unauthorized: 'Credenciais inválidas' });
			// }

			const jwtToken = jwt.sign({ id: entity.id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

			delete entity.dataValues.senha;

			return res.status(200).send({ jwtToken, entity });
		} catch (error) {
			if (error instanceof NoEntityError) {
				return res.status(400).send({ mensagem: 'Usuario não encontrado!' });
			}
			res.status(500).json({ error: error.message });
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
			return res.status(500).send({ message: `${error}` });
		}
	};
}

export default UserController;
