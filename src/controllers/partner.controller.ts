// /backend/src/controllers/partner.controller.ts

const { partnerService } = require('../services/partner.service');

class PartnerController {
  async getDashboard(req, res) {
    try {
      const data = await partnerService.getPartnerDashboardData(req.userId);
      return res.json(data);
    } catch (error) {
      return res.status(404).json({ message: error.message }); // 404 se não tiver parceiro
    }
  }
}

module.exports = { partnerController: new PartnerController() };