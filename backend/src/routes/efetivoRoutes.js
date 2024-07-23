import express from 'express';
import EfetivoController from '../controllers/efetivoController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js'

import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });


const router = express.Router();

router.get('/efetivo', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 1}), EfetivoController.getAllEntities, () => {/* #swagger.tags = ['Efetivo'] */});

router.get('/efetivo/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), EfetivoController.getEntityById, () => {/* #swagger.tags = ['Efetivo'] */});

router.get('/efetivo/consulta/:id', EfetivoController.getEntityBySaram, () => {/* #swagger.tags = ['Efetivo'] */});

router.post('/efetivo', upload.single('foto'), authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), EfetivoController.createEntity, () => {/* #swagger.tags = ['Efetivo'] */});

router.post('/efetivoLogin', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), EfetivoController.login, () => {/* #swagger.tags = ['Efetivo'] */});

router.put('/efetivo/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), EfetivoController.updateEntity, () => {/* #swagger.tags = ['Efetivo'] */});

router.delete('/efetivo/:id', authenticationMiddleware, authorizationMiddleware({nivel_acesso: 2}), EfetivoController.deleteEntity, () => {/* #swagger.tags = ['Efetivo'] */});

export default router;
