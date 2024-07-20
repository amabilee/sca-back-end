import Graduacao from '../models/Graduacao.js';

const graduacaoSeed = async () => {
    const graduacoesData = [
        { sigla: "CIVIL", descricao: "Civil", ordem: 1 },
        { sigla: "S2", descricao: "Soldado-de-Segundo-Classe", ordem: 2 },
        { sigla: "S1", descricao: "Soldado-de-Primeira-Classe", ordem: 3 },
        { sigla: "Cb", descricao: "Cabo", ordem: 4 },
        { sigla: "3S", descricao: "Terceiro-Sargento", ordem: 5 },
        { sigla: "2S", descricao: "Segundo-Sargento", ordem: 6 },
        { sigla: "1S", descricao: "Primeiro-Sargento", ordem: 7 },
        { sigla: "SO", descricao: "Suboficial", ordem: 8 },
        { sigla: "Asp", descricao: "Aspirante", ordem: 9 },
        { sigla: "2º Ten", descricao: "2º Tenente", ordem: 10 },
        { sigla: "1º Ten", descricao: "1º Tenente", ordem: 11 },
        { sigla: "Cap", descricao: "Capitão", ordem: 12 },
        { sigla: "Maj", descricao: "Major", ordem: 13 },
        { sigla: "Ten Cel", descricao: "Tenente-Coronel", ordem: 14 },
        { sigla: "Cel", descricao: "Coronel", ordem: 15 },
        { sigla: "Brig", descricao: "Brigadeiro", ordem: 16 },
        { sigla: "Maj Brig", descricao: "Major-Brigadeiro", ordem: 17 },
        { sigla: "Ten Brig", descricao: "Tenente-Brigadeiro-do-Ar", ordem: 18 }
    ];

    const siglas = graduacoesData.map(graduacao => graduacao.sigla);

    const existingGraduacoes = await Graduacao.findAll({
        where: {
            sigla: siglas
        }
    });

    const existingSiglas = existingGraduacoes.map(graduacao => graduacao.sigla);
    const newGraduacoes = graduacoesData.filter(graduacao => !existingSiglas.includes(graduacao.sigla));

    if (newGraduacoes.length > 0) {
        await Graduacao.bulkCreate(newGraduacoes);
        console.log('Novas graduações criadas com sucesso!');
    } else {
        console.log('Todas as graduações base já existem no banco de dados.');
    }
};

export default graduacaoSeed;
