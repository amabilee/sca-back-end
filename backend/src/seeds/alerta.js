import Alertas from '../models/Alerta.js';

const alertaSeed = async () => {
    const alertasData = [
        { nome_alerta: "Normal", cor: "#238043", ativo_alerta: true },
        { nome_alerta: "Desertor", cor: "#F41A10", ativo_alerta: true },
        { nome_alerta: "Estrangeiro", cor: "#FFEF5B", ativo_alerta: true },
        { nome_alerta: "Entrada proíbida", cor: "#F41A10", ativo_alerta: true },
        { nome_alerta: "Acesso expirado", cor: "#FF5BEF", ativo_alerta: true }
    ];

    const alertasNomes = alertasData.map(alerta => alerta.nome_alerta);
    
    const existingAlerts = await Alertas.findAll({
        where: {
            nome_alerta: alertasNomes
        }
    });

    const existingAlertNames = existingAlerts.map(alerta => alerta.nome_alerta);
    const newAlertas = alertasData.filter(alerta => !existingAlertNames.includes(alerta.nome_alerta));

    if (newAlertas.length > 0) {
        await Alertas.bulkCreate(newAlertas);
        console.log('Novos alertas criados com sucesso!');
    } else {
        console.log('Todos os alertas base já existem no banco de dados.');
    }
};

export default alertaSeed;
