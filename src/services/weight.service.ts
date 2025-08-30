// /backend/src/services/weight.service.ts

import { prisma } from '../lib/prisma';
const { achievementService } = require('./achievement.service'); // <-- Importe o serviço

class WeightService {
  async create(weight: number, userId: string) {
    if (!weight || weight <= 0) {
      throw new Error('Peso inválido.');
    }
    const newLog = await prisma.weightLog.create({
      data: {
        weight,
        userId,
      },
    });

    // NOVA LÓGICA: Verifica por novas conquistas após registrar o peso
    await achievementService.checkAndAwardAchievements(userId);

    return newLog;
  }

  async listByUserId(userId: string) {
    const logs = await prisma.weightLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        logDate: 'desc', // Do mais recente para o mais antigo
      },
    });
    return logs;
  }
}

module.exports = { weightService: new WeightService() };
