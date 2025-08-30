// /backend/src/controllers/notification.controller.ts

const { notificationService } = require('../services/notification.service');

class NotificationController {
  async list(req, res) {
    try {
      const notifications = await notificationService.listByUserId(req.userId);
      return res.json(notifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async markAllAsRead(req, res) {
    try {
      await notificationService.markAllAsRead(req.userId);
      return res.status(200).json({ message: 'Notificações marcadas como lidas.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = { notificationController: new NotificationController() };