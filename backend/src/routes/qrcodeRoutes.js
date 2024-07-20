import express from 'express';
import QRCodeController from '../controllers/qrcodeController.js';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
import authorizationMiddleware from '../middlewares/authorizationMiddleware.js';

const router = express.Router();

router.get('/qrcode', QRCodeController.getAllEntities, () => {
  /* #swagger.tags = ['QRCode'] */});

router.get('/qrcode/:qrcode', QRCodeController.getEntityByQRCode, () => {
  /* #swagger.tags = ['QRCode'] */});

router.post('/qrcode', QRCodeController.createEntity, () => {
  /* #swagger.tags = ['QRCode'] */});

router.put('/qrcode/:qrcode', QRCodeController.updateEntity, () => {
  /* #swagger.tags = ['QRCode'] */});

router.delete('/qrcode/:qrcode', QRCodeController.deleteEntity, () => {
  /* #swagger.tags = ['QRCode'] */});

export default router;
