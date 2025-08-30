// /backend/src/services/notification.service.ts

const { prisma } = require('../lib/prisma');

class NotificationService {
  async listByUserId(userId) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications;
  }

  async markAllAsRead(userId) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}

module.exports = { notificationService: new NotificationService() };