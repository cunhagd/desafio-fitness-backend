// /backend/src/controllers/weight.controller.ts

import { Request, Response } from 'express';
import { weightService } from '../services/weight.service';

class WeightController {
  async create(req: Request, res: Response) {
    const { weight } = req.body;
    const userId = req.userId; // Pegamos o ID do usuário que o middleware nos deu

    try {
      const newLog = await weightService.create(Number(weight), userId);
      return res.status(201).json(newLog);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  async list(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const logs = await weightService.listByUserId(userId);
      return res.json(logs);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}

export const weightController = new WeightController();