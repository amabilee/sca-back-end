import Usuario from '../models/Usuario.js';

const usuarioSeed = async () => {
	const existingUser = await Usuario.findOne();

	if (existingUser) {
		await Usuario.create({
			usuario: 123,
			senha: '123',
			nivel_acesso: 2,
			flag: 1
		});

		console.log('Usuário criado com sucesso!');
	} else {
		console.log('Já existe pelo menos um usuário no banco de dados.');
	}
};

export default usuarioSeed;
