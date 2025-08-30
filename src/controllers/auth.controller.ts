// /backend/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      return res.status(200).json(token);
    } catch (error) {
      if (error instanceof Error) {
        // Usamos 401 para erro de autenticação (não autorizado)
        return res.status(401).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}

export const authController = new AuthController();