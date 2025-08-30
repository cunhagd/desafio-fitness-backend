// /backend/src/controllers/dashboard.controller.ts

import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

class DashboardController {
  async get(req: Request, res: Response) {
    try {
      const data = await dashboardService.getDashboardData(req.userId);
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}

export const dashboardController = new DashboardController();