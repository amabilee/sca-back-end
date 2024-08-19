import Usuario from '../models/Usuario.js';
import UsuarioHasModulo from '../models/usuarioHasModulo.js';
import Modulo from '../models/Modulo.js';
import bcrypt from 'bcrypt';

const usuarioSeed = async () => {
  const senhaHashed = await bcrypt.hash("senha123", 10);

  const usuariosData = [
    {
      usuario: 1234567,
      senha: senhaHashed,
      nivel_acesso: 2,
      modulos: [
        '/relatorio-efetivos',
        '/relatorio-veiculos',
        '/postos',
        '/unidades',
        '/usuarios',
        '/alertas',
        '/efetivos',
        '/veiculos',
        '/crachas',
        '/pessoas',
        '/gerencia',
      ],
    },
    {
      usuario: 7654321,
      senha: senhaHashed,
      nivel_acesso: 1,
      modulos: [
        '/relatorio-efetivos',
        '/relatorio-veiculos',
        '/efetivos',
        '/veiculos',
        '/crachas',
        '/pessoas',
        '/gerencia',
      ],
    },
  ];

  const userUsuarios = usuariosData.map((user) => user.usuario);

  const existingUser = await Usuario.findAll({
    where: {
      usuario: userUsuarios,
    },
  });

  const existingUserUsuarios = existingUser.map((user) => user.usuario);
  const newUsers = usuariosData.filter(
    (user) => !existingUserUsuarios.includes(user.usuario)
  );

  if (newUsers.length > 0) {
    const createdUsers = await Usuario.bulkCreate(newUsers, { returning: true });
    for (const userData of newUsers) {
      const newUser = createdUsers.find(user => user.usuario === userData.usuario);
      const userModulos = userData.modulos;
      const modulos = await Modulo.findAll({
        where: {
          link: userModulos,
        },
      });

      for (const modulo of modulos) {
        const existingAssociation = await UsuarioHasModulo.findOne({
          where: {
            id_usuario: newUser.id,
            id_modulo: modulo.id,
          },
        });

        if (!existingAssociation) {
          await UsuarioHasModulo.create({
            id_usuario: newUser.id,
            id_modulo: modulo.id,
          });
        }
      }
    }

    console.log('Novos usuários e associações de módulos criados com sucesso!');
  } else {
    console.log('Todos os usuários base já existem no banco de dados.');
  }
};

export default usuarioSeed;
