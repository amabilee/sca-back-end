import { Op } from 'sequelize';
import Entity from '../models/Cracha.js';
import { RegistroAcesso, Cracha, Qrcode, Efetivo, Graduacao, Veiculo, VeiculoSemAn, Dependente, Visitante, Unidade } from '../models/associations.js'

class CrachaController {
    static getAllEntities = async (req, res) => {
        const { page, ativo, numero, tipo } = req.query;
        const limit = 200;
        let whereCondition = {};
        let includeConditions = [];

        try {

            if (ativo == 'false') {
                whereCondition.ativo_cracha = { [Op.like]: false };
            } else {
                whereCondition.ativo_cracha = { [Op.like]: true };
            }

            if (numero) {
                whereCondition.numero_cracha = { [Op.like]: `%${numero}%` };
            }


            if (tipo === 'pessoa') {
                whereCondition.pessoa = { [Op.like]: true };
            }

            if (tipo === 'veiculo') {
                whereCondition.veiculo = { [Op.like]: true };
            }


            includeConditions.push({
                model: RegistroAcesso,
                attributes: ['autorizador', 'data', 'hora', 'detalhe', 'qrcode', 'id_veiculo', 'id_veiculo_sem_an', 'id_visitante', 'id_dependente', 'id_posto', 'sentinela'],
                as: 'UltimoRegistroAcessoPessoa',
                required: false,
                include: [
                    {
                        model: Qrcode,
                        as: 'EfetivoQrcode',
                        attributes: ['qrcode'],
                        include: [{
                            model: Efetivo,
                            as: 'Efetivo',
                            attributes: ['nome_guerra'],
                            include: [
                                {
                                    model: Graduacao,
                                    attributes: ['sigla']
                                },
                                {
                                    model: Unidade,
                                    attributes: ['nome']
                                }
                            ]
                        }]
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
                        model: Dependente,
                        attributes: ['cpf', 'nome']
                    },
                    {
                        model: Visitante,
                        attributes: ['cpf', 'nome', 'empresa', 'telefone']
                    },
                ],
                limit: 1,
                order: [['data', 'DESC'], ['hora', 'DESC']]
            });

            includeConditions.push({
                model: RegistroAcesso,
                attributes: ['autorizador', 'data', 'hora', 'detalhe', 'qrcode', 'id_veiculo', 'id_veiculo_sem_an', 'id_visitante', 'id_dependente', 'id_posto', 'sentinela'],
                as: 'UltimoRegistroAcessoVeiculo',
                required: false,
                include: [
                    {
                        model: Qrcode,
                        as: 'EfetivoQrcode',
                        attributes: ['qrcode'],
                        include: [{
                            model: Efetivo,
                            as: 'Efetivo',
                            attributes: ['nome_guerra'],
                            include: [
                                {
                                    model: Graduacao,
                                    attributes: ['sigla']
                                },
                                {
                                    model: Unidade,
                                    attributes: ['nome']
                                }
                            ]
                        }]
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
                        model: Dependente,
                        attributes: ['cpf', 'nome']
                    },
                    {
                        model: Visitante,
                        attributes: ['cpf', 'nome', 'empresa', 'telefone']
                    }
                ],
                limit: 1,
                order: [['data', 'DESC'], ['hora', 'DESC']]
            });

            const offset = page ? (Number(page) - 1) * limit : 0;

            const { count, rows: entities } = await Cracha.findAndCountAll({
                where: whereCondition,
                include: includeConditions,
                order: [['numero_cracha', 'DESC']],
                limit,
                offset
            });

            const totalPages = Math.ceil(count / limit);

            const pagination = {
                path: '/cracha',
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


    static createEntity = async (req, res) => {
        try {
            const { nome, ativo_unidade, sinc } = req.body;

            const createdEntity = await Entity.create({
                nome,
                ativo_unidade,
                sinc
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
            const { ativo_cracha, sinc } = req.body;

            const [updatedRows] = await Entity.update(
                {
                    ativo_cracha,
                    sinc
                },
                { where: { numero_cracha: id } }
            );

            if (updatedRows > 0) {
                res.status(200).send({ message: 'Entity updated successfully' });
            } else {
                res.status(400).send({
                    message: `Cracha ${id} not found!`
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

    static deleteEntity = async (req, res) => {
        try {
            const entity = await Entity.findByPk(req.params.id);
            if (entity) {
                await entity.destroy();
                return res.status(204).send();
            } else {
                return res.status(400).send({
                    message: `Cracha ${req.params.id} not found!`
                });
            }
        } catch (error) {
            return res.status(500).send({ message: `${error}` });
        }
    };
}

export default CrachaController;
