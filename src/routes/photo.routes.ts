// /backend/src/routes/photo.routes.ts
import { Router } from 'express';
import { photoController } from '../controllers/photo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const photoRoutes = Router();
photoRoutes.use(authMiddleware);

photoRoutes.post('/', photoController.upload);
photoRoutes.get('/', photoController.list);
photoRoutes.delete('/:id', photoController.delete);

export { photoRoutes };