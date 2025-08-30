// /backend/src/controllers/balance.controller.ts
import { Request, Response } from 'express';
import { balanceService } from '../services/balance.service';

class BalanceController {
  async get(req: Request, res: Response) {
    try {
      const balanceData = await balanceService.getByUserId(req.userId);
      return res.json(balanceData);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }
// Novo método para criar um depósito
  async createDeposit(req: Request, res: Response) {
    const userId = req.userId; // ID do usuário logado
    try {
      const newTransaction = await balanceService.createDeposit(userId);
      return res.status(201).json(newTransaction);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}

export const balanceController = new BalanceController();