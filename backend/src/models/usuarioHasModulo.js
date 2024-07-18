import db from '../config/dbConnect.js';
import Sequelize from 'sequelize';
import Usuario from './Usuario.js';
import Modulo from './Modulo.js';

const UsuarioHasModulo = db.define('UsuarioHasModulo', {
    id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: Usuario,
            key: 'id',
        },
    },
    id_modulo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            model: Modulo,
            key: 'id',
        },
    },
}, {
    tableName: 'usuario_has_modulo',
    timestamps: false, 
});

export default UsuarioHasModulo;
