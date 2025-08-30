// /backend/src/services/partner.service.ts

const { prisma } = require('../lib/prisma');

class PartnerService {
  async getPartnerDashboardData(userId) {
    // 1. Encontra o usuário atual para pegar o ID do parceiro
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });

    if (!user || !user.partnerId) {
      throw new Error('Você não tem um parceiro para visualizar.');
    }
    
    const partnerId = user.partnerId;

    // 2. Busca todos os dados do parceiro em paralelo
    const [
      partner,
      partnerWeightLogs,
      partnerErrorLogs,
      partnerPhotos,
      partnerAchievements,
    ] = await Promise.all([
      prisma.user.findUnique({ where: { id: partnerId } }),
      prisma.weightLog.findMany({ where: { userId: partnerId }, orderBy: { logDate: 'asc' } }),
      prisma.errorLog.findMany({ where: { userId: partnerId }, orderBy: { erroredAt: 'desc' } }),
      prisma.progressPhoto.findMany({ where: { userId: partnerId }, orderBy: { createdAt: 'desc' } }),
      prisma.userAchievement.findMany({ where: { userId: partnerId }, select: { type: true } }),
    ]);

    if (!partner) {
      throw new Error('Parceiro não encontrado.');
    }
    
    // 3. Monta e retorna o objeto de dados completo
    return {
      firstName: partner.firstName,
      weightHistory: partnerWeightLogs.map(log => ({ date: log.logDate, weight: log.weight })),
      errorLogs: partnerErrorLogs,
      photos: partnerPhotos,
      achievementsCount: partnerAchievements.length,
    };
  }
}

module.exports = { partnerService: new PartnerService() };