import Usuario from './Usuario.js';
import Modulo from './Modulo.js';
import UsuarioHasModulo from './UsuarioHasModulo.js';
import Efetivo from './Efetivo.js';
import Unidade from './Unidade.js';
import Graduacao from './Graduacao.js';
import Alerta from './Alerta.js';
import Foto from './Foto.js';
import Veiculo from './Veiculo.js';
import Dependente from './Dependente.js';
import RegistroAcesso from './Registro_Acesso.js';
import Visitante from './Visitante.js';
import Cracha from './Cracha.js';
import VeiculoSemAn from './VeiculoSemAn.js';
import Qrcode from './Qrcode.js';
import Posto from './Posto.js';



//Usuário
Usuario.belongsToMany(Modulo, { through: UsuarioHasModulo, foreignKey: 'id_usuario' });
Usuario.hasOne(Efetivo, { foreignKey: 'qrcode_efetivo', sourceKey: 'usuario' });

//Modulos
Modulo.belongsToMany(Usuario, { through: UsuarioHasModulo, foreignKey: 'id_modulo' });

//Efetivo
Efetivo.belongsTo(Usuario, { foreignKey: 'qrcode_efetivo', targetKey: 'usuario' });
Efetivo.belongsTo(Unidade, { foreignKey: 'id_unidade' });
Efetivo.belongsTo(Graduacao, { foreignKey: 'id_graduacao' });
Efetivo.belongsTo(Alerta, { foreignKey: 'id_alerta', as: 'Alerta' });
Efetivo.belongsTo(Qrcode, { foreignKey: 'qrcode_efetivo', as: 'Qrcode' });
Efetivo.hasMany(Foto, { foreignKey: 'id_efetivo' });

// Efetivo
Foto.belongsTo(Efetivo, { foreignKey: 'id_efetivo' });

// Qrcode
Qrcode.hasOne(Efetivo, { foreignKey: 'qrcode_efetivo', as: 'Efetivo' });

//Veiculo
Veiculo.belongsTo(Efetivo, { foreignKey: 'id_efetivo' });

//Alerta
Alerta.hasMany(Efetivo, { foreignKey: 'id_alerta', as: 'Efetivos' });

//Dependente
Dependente.belongsTo(Efetivo, { foreignKey: 'id_efetivo' });

//Registro de acesso
RegistroAcesso.belongsTo(Posto, { foreignKey: 'id_posto' });
RegistroAcesso.belongsTo(Qrcode, { foreignKey: 'qrcode', as: 'EfetivoQrcode'});
RegistroAcesso.belongsTo(Qrcode, { foreignKey: 'sentinela', as: 'SentinelaQrcode' });
RegistroAcesso.belongsTo(Cracha, { foreignKey: 'cracha_pessoa', as: 'CrachaPessoa' });
RegistroAcesso.belongsTo(Cracha, { foreignKey: 'cracha_veiculo', as: 'CrachaVeiculo' });
RegistroAcesso.belongsTo(Visitante, { foreignKey: 'id_visitante' });
RegistroAcesso.belongsTo(Dependente, { foreignKey: 'id_dependente' });
RegistroAcesso.belongsTo(Veiculo, { foreignKey: 'id_veiculo' });
RegistroAcesso.belongsTo(VeiculoSemAn, { foreignKey: 'id_veiculo_sem_an' });

export {
  Usuario,
  Modulo,
  UsuarioHasModulo,
  Efetivo,
  Unidade,
  Graduacao,
  Alerta,
  Foto,
  Veiculo,
  Dependente,
  RegistroAcesso,
  Visitante,
  Cracha,
  VeiculoSemAn,
  Qrcode,
  Posto
};
