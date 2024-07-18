import db from '../config/dbConnect.js';
import Entity from '../models/Usuario.js';
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyPassword from '../util/verifyPassword.js';
import { Usuario, Modulo, UsuarioHasModulo, Efetivo, Unidade, Graduacao } from '../models/associations.js';

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
    const { page = 1 } = req.query;
    const limit = 10;

    try {
      const { count, rows: entities } = await Usuario.findAndCountAll({
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
        order: [['id', 'ASC']],
        offset: Number(page * limit - limit),
        limit: limit
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
    try {
      const {
        nome,
        cpf,
        usuario,
        nivel_acesso,
        ativo_usuario,
        modulos
      } = req.body;
      const entityId = req.params.id;

      const usuarioAlreadyExist = await Entity.findOne({
        where: {
          usuario,
          id: { [Op.not]: entityId }
        }
      });

      if (usuarioAlreadyExist) {
        return res
          .status(400)
          .send({ message: `Já existe um perfil com este usuário.` });
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
        res.status(200).send({ message: 'Entity updated successfully' });
      } else {
        res.status(404).send({
          message: `Id ${entityId} not found!`
        });
      }
    } catch (error) {
      res.status(500).send({ message: `${error.message}` });
    }
  };

  static getEntityById = async (req, res) => {
    try {
      const entity = await Entity.findByPk(req.params.id);

      if (entity) {
        delete entity.dataValues.senha;

        const modulos = await UsuarioHasModulo.findAll({
          where: { id_usuario: entity.id },
          include: [{
            model: Modulo,
            attributes: ['id', 'descricao', 'link', 'icone', 'ordem']
          }],
          raw: false,
        });

        res.status(200).json({ entity, modulos });
      } else {
        res.status(400).send({
          message: `Id ${req.params.id} not found!`
        });
      }
    } catch (error) {
      res.status(500).send({ message: `${error}` });
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
}

export default UserController;
