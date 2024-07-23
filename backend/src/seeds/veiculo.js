import Veiculo from '../models/Veiculo.js';
import Efetivo from '../models/Efetivo.js'

const veiculoSeed = async () => {

    try {

        const efetivoData = [{qrcode_efetivo: 1234567}, {qrcode_efetivo: 7654321}]

        const EfetivosQrCode = efetivoData.map(efetivo => efetivo.qrcode_efetivo);

        const entity = await Efetivo.findAll({
            where: {
                qrcode_efetivo: EfetivosQrCode
            }
        });


        if (entity) {
            const veiculosData = [
                {
                    id_efetivo: entity[1].qrcode_efetivo,
                    qrcode: 54321,
                    tipo: "Motocicleta",
                    cor_veiculo: "Preto",
                    placa: "QWE4321",
                    modelo: "XRE 190",
                    marca: "Honda",
                    renavam: 10987654321
                },
                {
                    id_efetivo: entity[0].qrcode_efetivo,
                    qrcode: 12345,
                    tipo: "Carro",
                    cor_veiculo: "Branco",
                    placa: "ASD1234",
                    modelo: "Fiesta",
                    marca: "Ford",
                    renavam: 12345678901
                }

            ];

            const veiculosQrCode = veiculosData.map(veiculo => veiculo.qrcode);

            const existingVeiculos = await Veiculo.findAll({
                where: {
                    qrcode: veiculosQrCode
                }
            });

            const existingVeiculosQrCode = existingVeiculos.map(veiculo => veiculo.qrcode);
            const newVeiculos = veiculosData.filter(veiculo => !existingVeiculosQrCode.includes(veiculo.qrcode));

            if (newVeiculos.length > 0) {
                await Veiculo.bulkCreate(newVeiculos);
                console.log('Novos veículos criados com sucesso!');
            } else {
                console.log('Todos os veículos base já existem no banco de dados.');
            }
        } else {
            console.log(`Entity with id ${req.params.id} not found!`);
        }
    } catch (error) {
        console.log(`${error.message}`);
    }
};

export default veiculoSeed;
