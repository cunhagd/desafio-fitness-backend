// /backend/src/routes/invite.routes.ts
import { Router } from 'express';
import { inviteController } from '../controllers/invite.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
const inviteRoutes = Router();
inviteRoutes.use(authMiddleware);
inviteRoutes.post('/send', inviteController.send);
inviteRoutes.get('/pending', inviteController.getPending);
inviteRoutes.post('/respond', inviteController.respond);
inviteRoutes.get('/status', inviteController.getStatus);
inviteRoutes.delete('/remove', inviteController.remove);
export { inviteRoutes };