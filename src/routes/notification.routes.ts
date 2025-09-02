// /backend/src/routes/notification.routes.ts
import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const notificationRoutes = Router();
notificationRoutes.use(authMiddleware);
notificationRoutes.get('/', notificationController.list);
notificationRoutes.post('/read', notificationController.markAllAsRead);
export { notificationRoutes };