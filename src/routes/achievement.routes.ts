// /backend/src/routes/achievement.routes.ts
const { Router } = require('express');
const { achievementController } = require('../controllers/achievement.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const achievementRoutes = Router();
achievementRoutes.use(authMiddleware);

achievementRoutes.get('/', achievementController.list);

module.exports = { achievementRoutes };