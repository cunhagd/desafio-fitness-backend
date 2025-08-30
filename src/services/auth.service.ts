// /backend/src/services/auth.service.ts

import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

class AuthService {
  async login(email: string, password: string) {
    // 1. Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Email ou senha inválidos.');
    }

    // 2. Comparar a senha enviada com a senha criptografada no banco
    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Error('Email ou senha inválidos.');
    }

    // 3. Gerar o token JWT
    const token = sign(
      {
        // Informações que queremos guardar no token
        firstName: user.firstName,
      },
      process.env.JWT_SECRET as string, // Nosso segredo
      {
        subject: user.id, // O "dono" do token
        expiresIn: '1d', // Validade do token (1 dia)
      }
    );

    // 4. Retornar o token
    return { token };
  }
}

export const authService = new AuthService();