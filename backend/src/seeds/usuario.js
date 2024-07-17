import Usuario from '../models/Usuario.js';

const usuarioSeed = async () => {
	// const existingUser = await Usuario.findOne();

	// if (!existingUser) {
	// 	await Usuario.create({
	// 		nome: "Usuario 1",
	// 		cpf: "000.000.000-00",
	// 		usuario: 123,
	// 		senha: '123',
	// 		nivel_acesso: 2,
	// 		modulos: "Relatórios, Relatórios-Efetivo, Relatórios-Veículo, Pessoas, Pessoas-Efetivo, Pessoas-Usuário, Postos, Unidades, Veículos, Alertas, Crachás, Gerência",
	// 		ativo_usuario: true
	// 	});

	// 	console.log('Usuário criado com sucesso!');
	// } else {
	// 	console.log('Já existe pelo menos um usuário no banco de dados.');
	// }
};

export default usuarioSeed;
