// /backend/src/routes/achievement.routes.ts
import { Router } from 'express';
import { achievementController } from '../controllers/achievement.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const achievementRoutes = Router();
achievementRoutes.use(authMiddleware);
achievementRoutes.get('/', achievementController.list);
export { achievementRoutes };