import express from 'express';
import GerenciaController from '../controllers/gerenciaController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const router = express.Router();

router.get('/gerencia', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), GerenciaController.getAllEntities, () => {/* #swagger.tags = ['Alerta'] */});


export default router;
