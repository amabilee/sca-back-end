import Postos from '../models/Posto.js';

const postoSeed = async () => {
    const postosData = [
        { nome: "Portão Oeste", nivel_acesso: 1, ativo_posto: true },
        { nome: "Portão Principal", nivel_acesso: 2, ativo_posto: true },
        { nome: "Portão Operacional", nivel_acesso: 3, ativo_posto: true },
    ];

    const postosNome = postosData.map(posto => posto.nome);
    
    const existingPostos = await Postos.findAll({
        where: {
            nome: postosNome
        }
    });

    const existingPostosNames = existingPostos.map(posto => posto.nome);
    const newPostos = postosData.filter(posto => !existingPostosNames.includes(posto.nome));

    if (newPostos.length > 0) {
        await Postos.bulkCreate(newPostos);
        console.log('Novos postos criados com sucesso!');
    } else {
        console.log('Todos os postos base já existem no banco de dados.');
    }
};

export default postoSeed;
