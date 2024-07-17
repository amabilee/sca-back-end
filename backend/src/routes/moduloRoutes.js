import express from 'express';
import ModulosController from '../controllers/moduloController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/modulo', ModulosController.getAllEntities, () => {
  /* #swagger.tags = ['Modulo'] */
});

router.get('/modulo/:id', ModulosController.getEntityById, () => {
  /* #swagger.tags = ['Modulo'] */
});

router.post('/modulo', ModulosController.createEntity, () => {
  /* #swagger.tags = ['Modulo'] */
});

router.put('/modulo/:id', ModulosController.updateEntity, () => {
  /* #swagger.tags = ['Modulo'] */
});

router.delete('/modulo/:id', ModulosController.deleteEntity, () => {
  /* #swagger.tags = ['Modulo'] */
});

export default router;
