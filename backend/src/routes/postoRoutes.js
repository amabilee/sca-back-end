import express from 'express';
import PostoController from '../controllers/postoController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/posto', PostoController.getAllEntities, () => {
  /* #swagger.tags = ['Posto'] */
});

router.get('/posto/:id', PostoController.getEntityById, () => {
  /* #swagger.tags = ['Posto'] */
});

router.post('/posto', PostoController.createEntity, () => {
  /* #swagger.tags = ['Posto'] */
});

router.put('/posto/:id', PostoController.updateEntity, () => {
  /* #swagger.tags = ['Posto'] */
});

router.delete('/posto/:id', PostoController.deleteEntity, () => {
  /* #swagger.tags = ['Posto'] */
});

export default router;
