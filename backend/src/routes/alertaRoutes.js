import express from 'express';
import AlertaController from '../controllers/alertaController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

const router = express.Router();

router.get('/alerta', AlertaController.getAllEntities, () => {
  /* #swagger.tags = ['Alerta'] */
});

router.get('/alerta/:id', AlertaController.getEntityById, () => {
  /* #swagger.tags = ['Alerta'] */
});

router.post('/alerta', AlertaController.createEntity, () => {
  /* #swagger.tags = ['Alerta'] */
});

router.put('/alerta/:id', AlertaController.updateEntity, () => {
  /* #swagger.tags = ['Alerta'] */
});

router.delete('/alerta/:id', AlertaController.deleteEntity, () => {
  /* #swagger.tags = ['Alerta'] */
});

export default router;
