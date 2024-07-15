import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get( '/usuario', UsuarioController.getAllEntities, () => { /* #swagger.tags = ['Usuario']*/ });

router.get( '/usuario/:id', UsuarioController.getEntityById, () => { /* #swagger.tags = ['Usuario']*/ });

router.post( '/usuario', UsuarioController.createEntity, () => { /* #swagger.tags = ['Usuario']*/ });

router.put( '/usuario/:id', UsuarioController.updateEntity, () => { /* #swagger.tags = ['Usuario']*/ });

router.post('/usuarioLogin', UsuarioController.login, () => { /* #swagger.tags = ['Usuario'] */});

router.delete( '/usuario/:id', UsuarioController.deleteEntity, () => { /* #swagger.tags = ['Usuario']*/ });

export default router;
