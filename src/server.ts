// /backend/src/server.ts
import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/user.routes';
import { authRoutes } from './routes/auth.routes';
import { weightRoutes } from './routes/weight.routes';
import { errorRoutes } from './routes/error.routes';
import { balanceRoutes } from './routes/balance.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { inviteRoutes } from './routes/invite.routes';
import { notificationRoutes } from './routes/notification.routes';
import { achievementRoutes } from './routes/achievement.routes';
import { photoRoutes } from './routes/photo.routes';
import { partnerRoutes } from './routes/partner.routes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/partner', partnerRoutes);

app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
});