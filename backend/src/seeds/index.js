import usuarioSeed from './usuario.js';
import alertaSeed from './alerta.js';
import graduacaoSeed from './graduacao.js';
import unidadeSeed from './unidade.js';
import qrcodeSeed from './qrcode.js';

const seed = async () => {
	await qrcodeSeed();
	await alertaSeed();
	await graduacaoSeed();
	await unidadeSeed();
	await usuarioSeed();
};

export default seed;
