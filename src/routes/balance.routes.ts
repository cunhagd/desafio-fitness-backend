// /backend/src/routes/balance.routes.ts
import { Router } from 'express';
import { balanceController } from '../controllers/balance.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const balanceRoutes = Router();
balanceRoutes.use(authMiddleware);

balanceRoutes.get('/', balanceController.get);
balanceRoutes.post('/deposit', balanceController.createDeposit);

export { balanceRoutes };