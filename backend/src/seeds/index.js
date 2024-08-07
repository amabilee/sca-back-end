import usuarioSeed from './usuario.js';
import alertaSeed from './alerta.js';
import graduacaoSeed from './graduacao.js';
import unidadeSeed from './unidade.js';
import qrcodeSeed from './qrcode.js';
import efetivoSeed from './efetivo.js'
import postoSeed from './posto.js';
import moduloSeed from './modulo.js';
import veiculoSeed from './veiculo.js';

const seed = async () => {
	//Efetivo
	await qrcodeSeed();
	await alertaSeed();
	await graduacaoSeed();
	await unidadeSeed();
	await efetivoSeed();

	//Usuario
	await moduloSeed();
	await usuarioSeed();

	//Registro
	await postoSeed();
	await veiculoSeed();
};

export default seed;
