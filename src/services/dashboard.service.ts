// /backend/src/services/dashboard.service.ts

import { prisma } from '../lib/prisma';

class DashboardService {
  async getDashboardData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const partnerId = user.partnerId;

    // Usaremos Promise.all para buscar todos os dados em paralelo
    const [
      userWeightLogs,
      userErrorCount,
      userTransactions,
      partner
    ] = await Promise.all([
      prisma.weightLog.findMany({ where: { userId }, orderBy: { logDate: 'asc' } }),
      prisma.errorLog.count({ where: { userId } }),
      prisma.transaction.findMany({ where: { userId } }),
      partnerId ? prisma.user.findUnique({ where: { id: partnerId } }) : Promise.resolve(null),
    ]);
    
    // Calcula o saldo do usuário
    const userBalance = userTransactions.reduce((acc, tx) => acc + tx.amount, 0);

    let partnerData = null;
    if (partner && partnerId) {
       const [partnerErrorCount, partnerTransactions] = await Promise.all([
         prisma.errorLog.count({ where: { userId: partnerId } }),
         prisma.transaction.findMany({ where: { userId: partnerId } }),
       ]);
       const partnerBalance = partnerTransactions.reduce((acc, tx) => acc + tx.amount, 0);
       partnerData = {
         firstName: partner.firstName,
         errorCount: partnerErrorCount,
         balance: partnerBalance,
       };
    }

    return {
      user: {
        firstName: user.firstName,
        initialWeight: user.initialWeight,
        goalWeight: user.goalWeight,
        currentWeight: userWeightLogs.length > 0 ? userWeightLogs[userWeightLogs.length - 1].weight : user.initialWeight,
        weightHistory: userWeightLogs.map(log => ({ date: log.logDate, weight: log.weight })),
        errorCount: userErrorCount,
        balance: userBalance,
      },
      partner: partnerData,
    };
  }
}

export const dashboardService = new DashboardService();