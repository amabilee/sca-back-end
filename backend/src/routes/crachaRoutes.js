import express from 'express';
import CrachaController from '../controllers/crachaController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/cracha', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), CrachaController.getAllEntities, () => {/* #swagger.tags = ['Unidade'] */});

router.get('/cracha/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}),  CrachaController.getEntityById, () => {/* #swagger.tags = ['Unidade'] */});

router.post('/cracha', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}),  CrachaController.createEntity, () => {/* #swagger.tags = ['Unidade'] */});

router.put('/cracha/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}),  CrachaController.updateEntity, () => {/* #swagger.tags = ['Unidade'] */});

router.delete('/cracha/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}),  CrachaController.deleteEntity, () => {/* #swagger.tags = ['Unidade'] */});

export default router;
