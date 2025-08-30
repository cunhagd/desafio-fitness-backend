// /backend/src/controllers/error.controller.ts

import { Request, Response } from 'express';
import { errorService } from '../services/error.service';

class ErrorController {
  async create(req: Request, res: Response) {
    const { type, reason } = req.body;
    const userId = req.userId; // ID do usuário vindo do token

    try {
      const newErrorLog = await errorService.create({ type, reason, userId });
      return res.status(201).json(newErrorLog);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  async list(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const logs = await errorService.listByUserId(userId);
      return res.json(logs);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
}

export const errorController = new ErrorController();