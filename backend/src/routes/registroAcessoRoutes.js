import express from 'express';
import RegistroAcessoController from '../controllers/registroAcessoController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/registro_acesso', RegistroAcessoController.getAllEntities, () => {
  /* #swagger.tags = ['RegistroAcesso'] */
});

router.get('/registro_acesso/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), RegistroAcessoController.getEntityById, () => {
  /* #swagger.tags = ['RegistroAcesso'] */
});

router.post('/registro_acesso', RegistroAcessoController.createEntity, () => {
  /* #swagger.tags = ['RegistroAcesso'] */
});

router.put('/registro_acesso/:id', RegistroAcessoController.updateEntity, () => {
  /* #swagger.tags = ['RegistroAcesso'] */
});

router.delete('/registro_acesso/:id', RegistroAcessoController.deleteEntity, () => {
  /* #swagger.tags = ['RegistroAcesso'] */
});

export default router;
