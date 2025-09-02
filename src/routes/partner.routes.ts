// /backend/src/routes/partner.routes.ts
import { Router } from 'express';
import { partnerController } from '../controllers/partner.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const partnerRoutes = Router();
partnerRoutes.use(authMiddleware);

partnerRoutes.get('/dashboard', partnerController.getDashboard);

export { partnerRoutes };