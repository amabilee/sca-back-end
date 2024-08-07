import fs from 'fs';
import path from 'path';
import Efetivo from '../models/Efetivo.js'
import Foto from '../models/Foto.js'
import Alerta from '../models/Alerta.js'
import Graduacao from '../models/Graduacao.js'
import Unidade from '../models/Unidade.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url';


const efetivoSeed = async () => {
  const efetivoData1 = {
    nome_completo: "Lucas Souza Castro",
    nome_guerra: "CASTRO",
    dependente: false,
    email: "lucas@gmail.com",
    cnh: 987654321,
    val_cnh: "2024-09-09",
    nivel_acesso: 1,
    ativo_efetivo: true,
    sinc_efetivo: 1,
    qrcode_efetivo: 7654321
  };

  const efetivoData2 = {
    nome_completo: "Marcos Santos Rocha",
    nome_guerra: "SANTOS",
    dependente: false,
    email: "marcos@gmail.com",
    cnh: 123456789,
    val_cnh: "2024-12-10",
    nivel_acesso: 1,
    ativo_efetivo: true,
    sinc_efetivo: 1,
    qrcode_efetivo: 1234567
  };


  const alertName = "Normal";
  const graduacaoNames = ["Cb", "SO"];
  const unidadeNames = ["RESERVA", "BAAN"];

  const alert = await Alerta.findOne({ where: { nome_alerta: alertName } });
  const gradList = await Graduacao.findAll({ where: { sigla: graduacaoNames } });
  const unidadeList = await Unidade.findAll({ where: { nome: unidadeNames } });

  if (!alert) {
    console.log('Alerta não encontrado!');
    return;
  }

  const gradMap = gradList.reduce((acc, grad) => {
    acc[grad.sigla] = grad.id;
    return acc;
  }, {});

  const unidadeMap = unidadeList.reduce((acc, unidade) => {
    acc[unidade.nome] = unidade.id;
    return acc;
  }, {});

  if (Object.keys(gradMap).length !== graduacaoNames.length || Object.keys(unidadeMap).length !== unidadeNames.length) {
    console.log('Alguma graduação ou unidade não encontrada!');
    return;
  }

  // First Efetivo
  const existingEfetivo1 = await Efetivo.findOne({ where: { qrcode_efetivo: efetivoData1.qrcode_efetivo } });

  if (!existingEfetivo1) {
    efetivoData1.id_graduacao = gradMap["Cb"];
    efetivoData1.id_alerta = alert.id;
    efetivoData1.id_unidade = unidadeMap["RESERVA"];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const imagePath1 = path.join(__dirname, '../', 'assets', '/soldado_1.png');
    const imageBuffer1 = fs.existsSync(imagePath1) ? fs.readFileSync(imagePath1) : null;

    const newEfetivo1 = await Efetivo.create(efetivoData1);

    if (imageBuffer1) {
      await Foto.create({
        id_efetivo: newEfetivo1.id,
        foto: imageBuffer1
      });
    }



    console.log('Primeiro Efetivo e Foto criados com sucesso!');
  } else {
    console.log('Primeiro Efetivo com QRCode já existe no banco de dados.');
  }

  // Second Efetivo
  const existingEfetivo2 = await Efetivo.findOne({ where: { qrcode_efetivo: efetivoData2.qrcode_efetivo } });

  if (!existingEfetivo2) {
    efetivoData2.id_graduacao = gradMap["SO"];
    efetivoData2.id_alerta = alert.id;
    efetivoData2.id_unidade = unidadeMap["BAAN"];

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const imagePath2 = path.join(__dirname, '../', 'assets', '/soldado_2.png');
    const imageBuffer2 = fs.existsSync(imagePath2) ? fs.readFileSync(imagePath2) : null;

    const newEfetivo2 = await Efetivo.create(efetivoData2);
    if (imageBuffer2) {
      await Foto.create({
        id_efetivo: newEfetivo2.id,
        foto: imageBuffer2
      });
    }

    console.log('Segundo Efetivo e Foto criados com sucesso!');
  } else {
    console.log('Segundo Efetivo com QRCode já existe no banco de dados.');
  }
};

export default efetivoSeed;
