// /backend/src/controllers/achievement.controller.ts
const { achievementService } = require('../services/achievement.service');

class AchievementController {
  async list(req, res) {
    try {
      const achievements = await achievementService.listForUser(req.userId);
      return res.json(achievements);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = { achievementController: new AchievementController() };