import express from 'express';
import UnidadeController from '../controllers/unidadeController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/unidade', UnidadeController.getAllEntities, () => {
  /* #swagger.tags = ['Unidade'] */
});

router.get('/unidade/:id', UnidadeController.getEntityById, () => {
  /* #swagger.tags = ['Unidade'] */
});

router.post('/unidade', UnidadeController.createEntity, () => {
  /* #swagger.tags = ['Unidade'] */
});

router.put('/unidade/:id', UnidadeController.updateEntity, () => {
  /* #swagger.tags = ['Unidade'] */
});

router.delete('/unidade/:id', UnidadeController.deleteEntity, () => {
  /* #swagger.tags = ['Unidade'] */
});

export default router;
