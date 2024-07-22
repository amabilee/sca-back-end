import express from 'express';
import ModulosController from '../controllers/moduloController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/modulo', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), ModulosController.getAllEntities, () => {/* #swagger.tags = ['Modulo'] */});

router.get('/modulo/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), ModulosController.getEntityById, () => {/* #swagger.tags = ['Modulo'] */});

router.post('/modulo', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), ModulosController.createEntity, () => {/* #swagger.tags = ['Modulo'] */});

router.put('/modulo/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), ModulosController.updateEntity, () => {/* #swagger.tags = ['Modulo'] */});

router.delete('/modulo/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), ModulosController.deleteEntity, () => {/* #swagger.tags = ['Modulo'] */});

export default router;
