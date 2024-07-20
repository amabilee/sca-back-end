import express from 'express';
import GraduacaoController from '../controllers/graduacaoController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/graduacao', GraduacaoController.getAllEntities, () => {
  /* #swagger.tags = ['Graduacao'] */});

router.get('/graduacao/:id', GraduacaoController.getEntityById, () => {
  /* #swagger.tags = ['Graduacao'] */});

router.post('/graduacao', GraduacaoController.createEntity, () => {
  /* #swagger.tags = ['Graduacao'] */});

router.put('/graduacao/:id', GraduacaoController.updateEntity, () => {
  /* #swagger.tags = ['Graduacao'] */});

router.delete('/graduacao/:id', GraduacaoController.deleteEntity, () => {
  /* #swagger.tags = ['Graduacao'] */});

export default router;
