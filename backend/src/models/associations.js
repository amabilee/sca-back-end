import Usuario from './Usuario.js';
import Modulo from './Modulo.js';
import UsuarioHasModulo from './UsuarioHasModulo.js';
import Efetivo from './Efetivo.js';
import Unidade from './Unidade.js';
import Graduacao from './Graduacao.js';

Usuario.belongsToMany(Modulo, { through: UsuarioHasModulo, foreignKey: 'id_usuario' });
Modulo.belongsToMany(Usuario, { through: UsuarioHasModulo, foreignKey: 'id_modulo' });

Usuario.hasOne(Efetivo, { foreignKey: 'qrcode_efetivo', sourceKey: 'usuario' });
Efetivo.belongsTo(Usuario, { foreignKey: 'qrcode_efetivo', targetKey: 'usuario' });

Efetivo.belongsTo(Unidade, { foreignKey: 'id_unidade' });
Efetivo.belongsTo(Graduacao, { foreignKey: 'id_graduacao' });

export { Usuario, Modulo, UsuarioHasModulo, Efetivo, Unidade, Graduacao };
