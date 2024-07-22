import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

const usuarioSeed = async () => {
	const senhaHashed = await bcrypt.hash("senha123", 10);

	const usuariosData = [
		{ usuario: 1234567, senha: senhaHashed, nivel_acesso: 2, modulos: [14, 15, 16, 17, 18, 19, 20 , 21, 22, 23, 24, 25, 26, 27, 28]},
		{ usuario: 7654321, senha: senhaHashed, nivel_acesso: 1, modulos: [15, 16, 17, 23, 25, 26, 27]}
	];

	const userUsuarios = usuariosData.map(user => user.usuario);

	const existingUser = await Usuario.findAll({
		where: {
			usuario: userUsuarios
		}
	});

	const existingUserUsuarios = existingUser.map(user => user.usuario);
	const newUsers = usuariosData.filter(user => !existingUserUsuarios.includes(user.usuario));

	if (newUsers.length > 0) {
		await Usuario.bulkCreate(newUsers);
		console.log('Novos usuários criados com sucesso!');
	} else {
		console.log('Todos os usuários base já existem no banco de dados.');
	}
};

export default usuarioSeed;
