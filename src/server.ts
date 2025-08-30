// /backend/src/server.ts

const express = require('express');
const cors = require('cors');
const { userRoutes } = require('./routes/user.routes');
const { authRoutes } = require('./routes/auth.routes');
const { weightRoutes } = require('./routes/weight.routes');
const { errorRoutes } = require('./routes/error.routes');
const { balanceRoutes } = require('./routes/balance.routes');
const { dashboardRoutes } = require('./routes/dashboard.routes');
const { inviteRoutes } = require('./routes/invite.routes');
const { notificationRoutes } = require('./routes/notification.routes');
const { achievementRoutes } = require('./routes/achievement.routes');
const { photoRoutes } = require('./routes/photo.routes');
const { partnerRoutes } = require('./routes/partner.routes');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());

// CORREÇÃO: Aumenta o limite para ambos os parsers para 50MB
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
app.use('/api/partner', partnerRoutes); // Adicione a nova rota

app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on http://localhost:${PORT}`);
});