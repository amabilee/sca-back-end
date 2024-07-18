import express from 'express';
import EfetivoController from '../controllers/efetivoController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const router = express.Router();

router.get('/efetivo', EfetivoController.getAllEntities, () => {
  /* #swagger.tags = ['Efetivo'] */
});

router.get('/efetivo/:id', EfetivoController.getEntityById, () => {
  /* #swagger.tags = ['Efetivo'] */
});

router.get('/efetivo/consulta/:id', EfetivoController.getEntityBySaram, () => {
  /* #swagger.tags = ['Efetivo'] */
});

router.post('/efetivo', EfetivoController.createEntity, () => {
  /* #swagger.tags = ['Efetivo'] */
});

router.post('/efetivoLogin', EfetivoController.login, () => {
	/* #swagger.tags = ['Efetivo'] */
});

router.put('/efetivo/:id', EfetivoController.updateEntity, () => {
  /* #swagger.tags = ['Efetivo'] */
});

router.delete('/efetivo/:id', EfetivoController.deleteEntity, () => {
  /* #swagger.tags = ['Efetivo'] */
});

export default router;
