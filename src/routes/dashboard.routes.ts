// /backend/src/routes/dashboard.routes.ts

import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const dashboardRoutes = Router();
dashboardRoutes.use(authMiddleware);

dashboardRoutes.get('/', dashboardController.get);

export { dashboardRoutes };