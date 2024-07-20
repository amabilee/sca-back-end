import Unidade from '../models/Unidade.js';

const unidadeSeed = async () => {
    const unidadesData = [
        { nome: "GAP AN", ativo_unidade: true },
        { nome: "OPERAÇÃO REGRESSO", ativo_unidade: true },
        { nome: "BAAN", ativo_unidade: true },
        { nome: "RESERVA", ativo_unidade: true },
        { nome: "3º GDAAE", ativo_unidade: true }
    ];

    const nomes = unidadesData.map(unidade => unidade.nome);

    const existingUnidades = await Unidade.findAll({
        where: {
            nome: nomes
        }
    });

    const existingNomes = existingUnidades.map(unidade => unidade.nome);

    const newUnidades = unidadesData.filter(unidade => !existingNomes.includes(unidade.nome));

    if (newUnidades.length > 0) {
        await Unidade.bulkCreate(newUnidades);
        console.log('Novas unidades criadas com sucesso!');
    } else {
        console.log('Todas as unidades base já existem no banco de dados.');
    }
};

export default unidadeSeed;
