// /backend/src/routes/error.routes.ts
import { Router } from 'express';
import { errorController } from '../controllers/error.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const errorRoutes = Router();
errorRoutes.use(authMiddleware);

errorRoutes.post('/', errorController.create);
errorRoutes.get('/', errorController.list);

export { errorRoutes };