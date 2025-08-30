// /backend/src/routes/partner.routes.ts

const { Router } = require('express');
const { partnerController } = require('../controllers/partner.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const partnerRoutes = Router();
partnerRoutes.use(authMiddleware);

// Rota principal para buscar todos os dados do parceiro
partnerRoutes.get('/dashboard', partnerController.getDashboard);

module.exports = { partnerRoutes };