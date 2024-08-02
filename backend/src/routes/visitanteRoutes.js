import express from 'express';
import VisitanteController from '../controllers/visitanteController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/visitante', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), VisitanteController.getAllEntities, () => {/* #swagger.tags = ['Visitante'] */});

router.get('/visitante/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), VisitanteController.getEntityById, () => {/* #swagger.tags = ['Visitante'] */});

router.post('/visitante', upload.single('foto'), authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), VisitanteController.createEntity, () => {/* #swagger.tags = ['Visitante'] */});

router.put('/visitante/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), VisitanteController.updateEntity, () => {/* #swagger.tags = ['Visitante'] */});

router.delete('/visitante/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), VisitanteController.deleteEntity, () => {/* #swagger.tags = ['Visitante'] */});


export default router;
