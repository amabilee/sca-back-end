import { Sequelize } from 'sequelize';
import Modulo from '../models/Modulo.js';

class ModuloController {
  static getAllEntities = async (req, res) => {
    try {
      const modulos = await Modulo.findAll({
        order: [['ordem', 'ASC']]
      });
      res.status(200).json(modulos);
    } catch (error) {
      res.status(500).send({ message: `${error.message}` });
    }
  };

  static getEntityById = async (req, res) => {
    const { id } = req.params;
    try {
      const modulo = await Modulo.findByPk(id);
      if (modulo) {
        res.status(200).json(modulo);
      } else {
        res.status(404).send({ message: 'Módulo não encontrado!' });
      }
    } catch (error) {
      res.status(500).send({ message: `${error.message}` });
    }
  };

  static createEntity = async (req, res) => {
    const { descricao, link, icone, ordem } = req.body;
    try {
      const novoModulo = await Modulo.create({
        descricao,
        link,
        icone,
        ordem
      });
      res.status(201).json(novoModulo);
    } catch (error) {
      res.status(500).send({ message: `${error.message}` });
    }
  };

  static updateEntity = async (req, res) => {
    const { id } = req.params;
    const { descricao, link, icone, ordem } = req.body;
    try {
      const [updatedRows] = await Modulo.update(
        {
          descricao,
          link,
          icone,
          ordem
        },
        { where: { id } }
      );
      if (updatedRows > 0) {
        res.status(200).send({ message: 'Módulo atualizado com sucesso!' });
      } else {
        res.status(404).send({ message: 'Módulo não encontrado!' });
      }
    } catch (error) {
      res.status(500).send({ message: `${error.message}` });
    }
  };

  static deleteEntity = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedRows = await Modulo.destroy({ where: { id } });
      if (deletedRows > 0) {
        res.status(204).send();
      } else {
        res.status(404).send({ message: 'Módulo não encontrado!' });
      }
    } catch (error) {
      res.status(500).send({ message: `${error.message}` });
    }
  };
}

export default ModuloController;
