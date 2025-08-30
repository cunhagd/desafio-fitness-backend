// /backend/src/services/balance.service.ts
import { prisma } from '../lib/prisma';

const MONTHLY_DEPOSIT_AMOUNT = 200;

class BalanceService {
  async getByUserId(userId: string) {
    // 1. Buscar todas as transações do usuário
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: 'desc' },
    });

    // 2. Calcular o saldo total
    const totalBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    return {
      transactions,
      totalBalance,
    };
  }
// Nova lógica para criar o depósito
  async createDeposit(userId: string) {
    // Lógica para evitar depósitos duplicados no mesmo mês (opcional, mas boa prática)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const existingDeposit = await prisma.transaction.findFirst({
      where: {
        userId,
        type: 'DEPOSIT',
        transactionDate: {
          gte: startOfMonth, // gte = greater than or equal to (maior ou igual a)
        },
      },
    });

    if (existingDeposit) {
      throw new Error('O depósito para este mês já foi registrado.');
    }

    // Cria a transação de depósito
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: MONTHLY_DEPOSIT_AMOUNT,
        description: 'Depósito mensal',
        type: 'DEPOSIT',
        userId,
      },
    });

    return newTransaction;
  }
}

export const balanceService = new BalanceService();