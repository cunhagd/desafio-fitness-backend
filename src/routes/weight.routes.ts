// /backend/src/routes/weight.routes.ts

import { Router } from 'express';
import { weightController } from '../controllers/weight.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const weightRoutes = Router();

// Todas as rotas aqui dentro usarão o middleware de autenticação
weightRoutes.use(authMiddleware);

weightRoutes.post('/', weightController.create);
weightRoutes.get('/', weightController.list);

export { weightRoutes };