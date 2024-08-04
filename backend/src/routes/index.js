import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../swagger/swagger_output.json' assert { type: 'json' };
import usuarios from './usuarioRoutes.js';
import efetivos from './efetivoRoutes.js';
import graduacoes from './graduacaoRoutes.js';
import postos from './postoRoutes.js';
import qrcodes from './qrcodeRoutes.js';
import registroAcessos from './registroAcessoRoutes.js';
import unidades from './unidadeRoutes.js';
import veiculos from './veiculoRoutes.js';
import visitantes from './visitanteRoutes.js';
import dependentes from './dependenteRoutes.js';
import alerta from './alertaRoutes.js';
import modulo from './moduloRoutes.js';
import veiculosSemAn from './veiculoSemAnRoutes.js';
import gerencia from './gerenciaRoute.js';

const routes = (app) => {
	const swaggerUiOptions = {
		customJs: '../../swagger/custom.js'
	};

	app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile, swaggerUiOptions));

	app.use(express.json());

	app.use('/', usuarios);
	app.use('/', efetivos);
	app.use('/', graduacoes);
	app.use('/', postos);
	app.use('/', qrcodes);
	app.use('/', registroAcessos);
	app.use('/', unidades);
	app.use('/', veiculos);
	app.use('/', visitantes);
	app.use('/', dependentes);
	app.use('/', alerta);
	app.use('/', modulo);
	app.use('/', veiculosSemAn);
	app.use('/', gerencia);
};

export default routes;
