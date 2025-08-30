// /backend/src/services/user.service.ts

import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hash } from 'bcryptjs';

// Schema de validação com Zod
const userSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  birthDate: z.coerce.date(), // 'coerce' converte a string do JSON para Date
  height: z.number().int().positive(),
  initialWeight: z.number().positive(),
  goalWeight: z.number().positive(),
});

class UserService {
  async create(userData: unknown) {
    // 1. Validar os dados
    const validatedData = userSchema.parse(userData);
    const { 
      email, 
      password, 
      // ...resto dos dados
      ...restOfData 
    } = validatedData;

    // 2. Verificar se o email já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error('Este email já está em uso.');
    }

    // 3. Criptografar a senha
    const hashedPassword = await hash(password, 8);

    // 4. Salvar no banco de dados
    const user = await prisma.user.create({
      data: {
        ...restOfData,
        email,
        password: hashedPassword,
      },
    });
    
    // 5. Retornar o usuário criado (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const userService = new UserService();