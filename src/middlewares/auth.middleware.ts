// /backend/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
}

// Criamos um tipo customizado para a Request do Express
declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string);
    const { sub } = decoded as TokenPayload;

    // Adicionamos o ID do usuário na requisição para usá-lo depois
    req.userId = sub;

    return next(); // Permite que a requisição continue
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}