import QRCode from '../models/QRCode.js';

const qrcodeSeed = async () => {
    const qrcodesData = [
        { qrcode: 1234567, nivel_acesso: 1 },
        { qrcode: 7654321, nivel_acesso: 1 },
        { qrcode: 12345, nivel_acesso: 2 },
        { qrcode: 54321, nivel_acesso: 2 },
    ];

    const qrcodes = qrcodesData.map(qr => qr.qrcode);

    const existingQRCodes = await QRCode.findAll({
        where: {
            qrcode: qrcodes
        }
    });

    const existingQRCodesList = existingQRCodes.map(qr => qr.qrcode);
    const newQRCodes = qrcodesData.filter(qr => !existingQRCodesList.includes(qr.qrcode));

    if (newQRCodes.length > 0) {
        await QRCode.bulkCreate(newQRCodes);
        console.log('Novos QRCodes criados com sucesso!');
    } else {
        console.log('Todos os QRCodes base já existem no banco de dados.');
    }
};

export default qrcodeSeed;
