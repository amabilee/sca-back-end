import { Op, fn, col, literal } from 'sequelize';
import moment from 'moment';
import Usuario from '../models/Usuario.js';
import Unidade from '../models/Unidade.js';
import Cracha from '../models/Cracha.js';
import Qrcode from '../models/Qrcode.js';
import Efetivo from '../models/Efetivo.js';
import Visitante from '../models/Visitante.js';
import Dependente from '../models/Dependente.js';
import RegistroAcesso from '../models/Registro_Acesso.js';
import Veiculo from '../models/Veiculo.js';
import VeiculoSemAn from '../models/VeiculoSemAn.js';

class GerenciaController {
    static getAllEntities = async (req, res) => {
        try {
            
            const modelsToCount = [
                { model: Usuario, alias: 'usuario' },
                { model: Cracha, alias: 'cracha' },
                { model: Unidade, alias: 'unidade' },
                { model: Qrcode, alias: 'qrcode' },
                { model: Efetivo, alias: 'efetivo' },
                { model: Visitante, alias: 'visitante' },
                { model: Dependente, alias: 'dependente' },
            ];

            const vehicleTypes = [
                { type: 'Carro', alias: 'carro' },
                { type: 'Motocicleta', alias: 'motocicleta' },
                { type: 'Ônibus', alias: 'onibus' },
                { type: 'Caminhoneta', alias: 'caminhoneta' },
            ];

            
            const countEntriesAndExits = async (type, condition) => {
                const results = await RegistroAcesso.findAll({
                    attributes: [
                        [literal('DAYOFWEEK(data)'), 'dayOfWeek'],
                        [fn('COUNT', col('id')), 'count']
                    ],
                    where: {
                        tipo: { [Op.like]: type },
                        data: { [Op.between]: [startOfWeek, endOfWeek] },
                        ...condition
                    },
                    group: ['dayOfWeek'],
                    order: [[literal('dayOfWeek'), 'ASC']],
                    raw: true
                });

                return new Array(7).fill(0).map((_, index) => {
                    const entry = results.find(r => r.dayOfWeek - 1 === index);
                    return entry ? parseInt(entry.count, 10) : 0;
                });
            };

            // Count models in parallel
            const countResults = await Promise.all(
                modelsToCount.map(({ model }) =>
                    model.count({ order: [['id', 'ASC']] })
                )
            );

            const counts = countResults.reduce((acc, count, index) => {
                acc[modelsToCount[index].alias] = count;
                return acc;
            }, {});

            // Count vehicles in parallel
            const vehicleCounts = await Promise.all(
                vehicleTypes.map(({ type }) =>
                    Promise.all([
                        Veiculo.count({ where: { tipo: { [Op.like]: type } } }),
                        VeiculoSemAn.count({ where: { tipo: { [Op.like]: type } } })
                    ])
                )
            );

            vehicleTypes.forEach(({ alias }, index) => {
                counts[alias] = vehicleCounts[index].reduce((a, b) => a + b, 0);
            });

            // Movimentacao Militares
            const currentDate = moment();
            const startOfWeek = currentDate.clone().startOf('week').format('YYYY-MM-DD');
            const endOfWeek = currentDate.clone().endOf('week').format('YYYY-MM-DD');

            const entriesCountByDayMilitar = await countEntriesAndExits('Entrada', {
                qrcode: { [Op.not]: null }
            });

            const exitsCountByDayMilitar = await countEntriesAndExits('Saída', {
                qrcode: { [Op.not]: null }
            });

            // Movimentacao Pessoas
            const entriesCountByDayPessoa = await countEntriesAndExits('Entrada', {
                [Op.or]: [
                    { id_visitante: { [Op.not]: null } },
                    { id_dependente: { [Op.not]: null } }
                ]
            });

            const exitsCountByDayPessoa = await countEntriesAndExits('Saída', {
                [Op.or]: [
                    { id_visitante: { [Op.not]: null } },
                    { id_dependente: { [Op.not]: null } }
                ]
            });

            // Movimentacao Veiculos
            const entriesCountByDayVeiculo = await countEntriesAndExits('Entrada', {
                [Op.or]: [
                    { id_veiculo: { [Op.not]: null } },
                    { id_veiculo_sem_an: { [Op.not]: null } }
                ]
            });

            const exitsCountByDayVeiculo = await countEntriesAndExits('Saída', {
                [Op.or]: [
                    { id_veiculo: { [Op.not]: null } },
                    { id_veiculo_sem_an: { [Op.not]: null } }
                ]
            });

            const formattedEntities = {
                ...counts,
                entradasPorDiaMilitar: entriesCountByDayMilitar,
                saidasPorDiaMilitar: exitsCountByDayMilitar,
                entradasPorDiaPessoa: entriesCountByDayPessoa,
                saidasPorDiaPessoa: exitsCountByDayPessoa,
                entradasPorDiaVeiculo: entriesCountByDayVeiculo,
                saidasPorDiaVeiculo: exitsCountByDayVeiculo,
            };

            res.status(200).json({ formattedEntities });
        } catch (error) {
            res.status(500).send({ message: `${error.message}` });
        }
    };
}

export default GerenciaController;
