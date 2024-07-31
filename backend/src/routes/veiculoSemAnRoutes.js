import express from 'express';
import VeiculoSemAnController from '../controllers/veiculoSemAnController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/veiculo_an',  authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), VeiculoSemAnController.getAllEntities, () => {/* #swagger.tags = ['Veiculo'] */});

router.get('/veiculo_an/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), VeiculoSemAnController.getEntityById, () => {/* #swagger.tags = ['Veiculo'] */});

router.get('/veiculo_an/consulta/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), VeiculoSemAnController.getEntityByPlaca, () => {/* #swagger.tags = ['Veiculo'] */});

router.post('/veiculo_an', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}),  VeiculoSemAnController.createEntity, () => {/* #swagger.tags = ['Veiculo'] */});

router.put('/veiculo_an/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}),  VeiculoSemAnController.updateEntity, () => {/* #swagger.tags = ['Veiculo'] */});

router.delete('/veiculo_an/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}),  VeiculoSemAnController.deleteEntity, () => {/* #swagger.tags = ['Veiculo'] */});

export default router;
