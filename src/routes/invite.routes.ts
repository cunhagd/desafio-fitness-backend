// /backend/src/routes/invite.routes.ts

const { Router } = require('express');
const { inviteController } = require('../controllers/invite.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const inviteRoutes = Router();
inviteRoutes.use(authMiddleware);

// Rota para enviar um convite
inviteRoutes.post('/send', inviteController.send);

// Rota para buscar convites pendentes para o usuário logado
inviteRoutes.get('/pending', inviteController.getPending);

// Rota para aceitar ou recusar um convite
inviteRoutes.post('/respond', inviteController.respond);

// Rota para verificar o status de parceria atual
inviteRoutes.get('/status', inviteController.getStatus);

// Rota para remover o parceiro atual
inviteRoutes.delete('/remove', inviteController.remove);

module.exports = { inviteRoutes };