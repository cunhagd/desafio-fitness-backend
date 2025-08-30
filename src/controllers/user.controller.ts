// /backend/src/controllers/user.controller.ts

import { Request, Response } from 'express';
import { userService } from '../services/user.service';

class UserController {
  async create(req: Request, res: Response) {
    try {
      const newUser = await userService.create(req.body);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}

export const userController = new UserController();