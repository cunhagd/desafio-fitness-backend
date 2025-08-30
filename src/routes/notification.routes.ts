// /backend/src/routes/notification.routes.ts

const { Router } = require('express');
const { notificationController } = require('../controllers/notification.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const notificationRoutes = Router();
notificationRoutes.use(authMiddleware);

// Rota para buscar todas as notificações do usuário
notificationRoutes.get('/', notificationController.list);

// Rota para marcar todas as notificações como lidas
notificationRoutes.post('/read', notificationController.markAllAsRead);

module.exports = { notificationRoutes };