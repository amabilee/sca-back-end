import Modulo from '../models/Modulo.js';

const moduloSeed = async () => {
    const modulosData = [
        { descricao: "Usuários", link: "/usuarios", icone: "usuario_icon.svg", ordem: 1 },
        { descricao: "Efetivos", link: "/efetivos", icone: "efetivo_icon.svg", ordem: 2 },
        { descricao: "Relatórios Efetivos", link: "/relatorio-efetivos", icone: "reports_efetivo_icon.svg", ordem: 3 },
        { descricao: "Relatórios Veículos", link: "/relatorio-veiculos", icone: "reports_veiculo_icon.svg", ordem: 4 },
        { descricao: "Alertas", link: "/alertas", icone: "alertas_icon.svg", ordem: 5 },
        { descricao: "Postos Serviço", link: "/postos", icone: "posto_icon.svg", ordem: 6 },
        { descricao: "Unidades", link: "/unidades", icone: "unidade_icon.svg", ordem: 7 },
        { descricao: "Veículos", link: "/veiculos", icone: "veiculo_icon.svg", ordem: 8 },
        { descricao: "Pessoas", link: "/pessoas", icone: "pessoa_icon.svg", ordem: 9 },
        { descricao: "Crachás", link: "/crachas", icone: "cracha_icon.svg", ordem: 10 },
        { descricao: "Gerência", link: "/gerencia", icone: "gerencia_icon.svg", ordem: 11 },
    ];


    const modulosLink = modulosData.map(modulo => modulo.link);

    const existingModulos = await Modulo.findAll({
        where: {
            link: modulosLink
        }
    });

    const existingModulosList = existingModulos.map(modulo => modulo.link);
    const newModulos = modulosData.filter(modulo => !existingModulosList.includes(modulo.link));

    if (newModulos.length > 0) {
        await Modulo.bulkCreate(newModulos);
        console.log('Novos Modulos criados com sucesso!');
    } else {
        console.log('Todos os Modulos base já existem no banco de dados.');
    }
};

export default moduloSeed;
