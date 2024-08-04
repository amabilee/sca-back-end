import Entity from '../models/VeiculoSemAn.js';
import Cracha from '../models/Cracha.js';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

class VeiculoSemAnController {
    static getAllEntities = async (req, res) => {
        const { page = 1} = req.query;
        const limit = 15;
        let whereClause = {};
        let includeConditions = [];

        try {
            const entities = await Entity.findAll({
                include: includeConditions,
                where: whereClause,
                order: [['id', 'ASC']],
                offset: Number(page * limit - limit),
                limit: limit,
                distinct: true
            });

            const count = await Entity.count({
                include: includeConditions,
                where: whereClause,
                distinct: true
            });

            const totalPages = Math.ceil(count / limit);


            const pagination = {
                path: '/veiculo_an',
                page: Number(page),
                prev_page: page > 1 ? Number(page) - 1 : false,
                next_page: Number(page) < totalPages ? Number(page) + 1 : false,
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
                return res.status(404).send({
                    message: `Veiculo ${req.params.id} not found!`
                });
            }
        } catch (error) {
            return res.status(500).send({ message: `${error.message}` });
        }
    };

    static createEntity = async (req, res) => {
        
        try {
            let {
                tipo,
                cor_veiculo,
                placa,
                modelo,
                marca,
                renavam,
                ativo_veiculo,
                sinc_veiculo
            } = req.body;
    
            const existingEntity = await Entity.findOne({ where: { placa: placa } });
            if (existingEntity) {
                return res.status(400).send({ message: 'Já existe um veículo cadastrado com esta placa!' });
            }

    
            const createdEntity = await Entity.create({
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
            return res.status(500).send({ message: `${error.message}` });
        }
    };

    static getEntityByPlaca = async (req, res) => {
        try {
            let whereCondition = {}
            whereCondition.placa = { [Op.like]: `%${req.params.id}%`}

            const entity = await Entity.findOne({
                where: whereCondition
            });

            if (entity) {
                return res.status(200).json(entity);
            } else {
                return res.status(404).send({
                    message: `Veiculo placa:${req.params.id} not found!`
                });
            }
        } catch (error) {
            return res.status(500).send({ message: `${error.message}` });
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

export default VeiculoSemAnController;