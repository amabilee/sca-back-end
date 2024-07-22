import db from '../config/dbConnect.js';
import Entity from '../models/Usuario.js';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyPassword from '../util/verifyPassword.js';
import { Usuario, Modulo, UsuarioHasModulo, Efetivo, Graduacao } from '../models/associations.js';

dotenv.config()

class UserController {

  static login = async (req, res) => {
    const { usuario, senha } = req.body;
    try {
      const entity = await Entity.findOne({ where: { usuario } });
      if (!entity) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      const isPasswordValid = await verifyPassword(entity, senha);

      if (!isPasswordValid) {
        return res.status(401).json({ unauthorized: 'Credenciais inválidas' });
      }

      const jwtToken = jwt.sign({ id: entity.id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

      delete entity.dataValues.senha;

      return res.status(200).send({ jwtToken, entity });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static getAllEntities = async (req, res) => {
    const { page = 1, nivel_acesso, modulo, nome_guerra } = req.query;
    const limit = 10;
    let whereCondition = {};
    let includeConditions = [];

    try {
      if (nivel_acesso) {
        whereCondition.nivel_acesso = nivel_acesso;
      }

      if (modulo) {
        includeConditions.push({
          model: Modulo,
          through: {
            model: UsuarioHasModulo,
            attributes: [],
          },
          where: {
            descricao: { [Sequelize.Op.like]: `%${modulo}%` }
          },
          attributes: ['descricao', 'link', 'icone', 'ordem'],
          required: true
        });
      } else {
        includeConditions.push({
          model: Modulo,
          through: {
            model: UsuarioHasModulo,
            attributes: [],
          },
          attributes: ['descricao', 'link', 'icone', 'ordem'],
        });
      }

      let count = await Usuario.count({
        include: [
          ...includeConditions,
          {
            model: Efetivo,
            required: false,
            where: nome_guerra ? { nome_guerra: { [Sequelize.Op.like]: `%${nome_guerra}%` } } : undefined,
            include: [
              {
                model: Graduacao,
                attributes: ['sigla'],
                required: false,
              }
            ],
          }
        ],
        where: whereCondition,
        distinct: true
      });

      const entities = await Usuario.findAll({
        include: [
          ...includeConditions,
          {
            model: Efetivo,
            required: false,
            where: nome_guerra ? { nome_guerra: { [Sequelize.Op.like]: `%${nome_guerra}%` } } : undefined,
            include: [
              {
                model: Graduacao,
                attributes: ['sigla'],
                required: false,
              }
            ],
            attributes: ['id', 'id_graduacao', 'nome_completo', 'nome_guerra'],
          }
        ],
        where: whereCondition,
        order: [['id', 'ASC']],
        offset: Number(page * limit - limit),
        limit: limit,
        distinct: true
      });

      const totalPages = Math.ceil(count / limit);

      const formattedEntities = entities.map(entity => ({
        id: entity.id,
        usuario: entity.usuario,
        nivel_acesso: entity.nivel_acesso,
        flag: entity.flag,
        auth: entity.auth,
        nome_guerra: entity.Efetivo ? entity.Efetivo.nome_guerra : null,
        graduacao: entity.Efetivo && entity.Efetivo.Graduacao ? entity.Efetivo.Graduacao.sigla : null,
        Modulos: entity.Modulos,
      }));

      const pagination = {
        path: '/usuario',
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

  static createEntity = async (req, res) => {
    const transaction = await db.transaction();
    try {
      const { usuario, senha, nivel_acesso, modulos } = req.body;
      const senhaHashed = await bcrypt.hash(senha, 10);

      const createdUsuario = await Entity.create(
        {
          usuario,
          senha: senhaHashed,
          nivel_acesso
        },
        { transaction }
      );
      for (const moduloId of modulos) {
        await UsuarioHasModulo.create(
          {
            id_usuario: createdUsuario.id,
            id_modulo: moduloId
          },
          { transaction }
        );
      }

      await transaction.commit();
      res.status(201).send({ usuario: createdUsuario });
    } catch (error) {
      await transaction.rollback();
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).send({ message: 'Valores já cadastrados!' });
      } else {
        res.status(500).send({ message: `${error.message}` });
      }
    }
  };

  static updateEntity = async (req, res) => {
    const transaction = await db.transaction();
  
    try {
      const entityId = parseInt(req.params.id, 10);
      const { usuario, nivel_acesso, modulos, senha } = req.body;
  
      const existingUser = await Usuario.findByPk(entityId);
      if (!existingUser) {
        return res.status(404).send({
          message: `Id ${entityId} not found!`
        });
      }

      let updatedFields = { usuario, nivel_acesso }; 
  
      if (senha) {
        const senhaHashed = await bcrypt.hash(senha, 10);
        updatedFields.senha = senhaHashed;
      }
  
      const [updatedRows] = await Usuario.update(updatedFields, {
        where: { id: entityId },
        transaction
      });
  
      if (modulos && modulos.length > 0) {
        await UsuarioHasModulo.destroy({ where: { id_usuario: entityId }, transaction });
  
        const createPromises = modulos.map(moduloId => {
          return UsuarioHasModulo.create(
            {
              id_usuario: entityId,
              id_modulo: moduloId
            },
            { transaction }
          );
        });
  
        await Promise.all(createPromises);
      } else {
        await UsuarioHasModulo.destroy({ where: { id_usuario: entityId }, transaction });
      }
  
      await transaction.commit();
      res.status(200).send({ message: 'Entity updated successfully' });
    } catch (error) {
      await transaction.rollback();
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
          message: `Id ${req.params.id} not found!`
        });
      }
    } catch (error) {
      res.status(500).send({ message: `${error}` });
    }
  };

  static getEntityById = async (req, res) => {
    try {
      const entity = await Entity.findAll({
        where: { id: req.params.id },
        include: [
          {
            model: Modulo,
            through: {
              model: UsuarioHasModulo,
              attributes: [],
            },
            attributes: ['descricao', 'link', 'icone', 'ordem'],
          },
          {
            model: Efetivo,
            include: [
              {
                model: Graduacao,
                attributes: ['sigla'],
              }
            ],
            attributes: ['id', 'id_graduacao', 'nome_completo', 'nome_guerra'],
          }
        ],
        raw: false,
      });

      res.status(200).json({ entity });
      if (!entity) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
    }
    catch (error) {
      return res.status(500).send({ message: `${error.message}` });
    }
  };
}

export default UserController;
