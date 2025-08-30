// /backend/src/services/error.service.ts

const { prisma } = require('../lib/prisma');
const { achievementService } = require('./achievement.service'); // Importa o serviço de conquistas
const { AchievementType } = require('@prisma/client');

class ErrorService {
  async create({ type, reason, userId }) {
    if (!type || !['DRINKING', 'SMOKING', 'BOTH'].includes(type)) {
      throw new Error('Tipo de erro inválido.');
    }
    if (!reason || reason.trim().length < 10) {
      throw new Error('O motivo do erro deve ter pelo menos 10 caracteres.');
    }

    const PENALTY_AMOUNT = 50;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Encontrar o usuário e seu parceiro
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { partnerId: true, firstName: true },
      });

      if (!user || !user.partnerId) {
        throw new Error('Usuário ou parceiro não encontrado. A penalidade não pode ser aplicada.');
      }
      const partnerId = user.partnerId;

      // 2. Criar o registro de erro
      const newErrorLog = await tx.errorLog.create({
        data: { type, reason, userId },
      });

      // 3. Criar as transações financeiras
      await tx.transaction.create({
        data: {
          amount: -PENALTY_AMOUNT,
          description: `Penalidade por erro: ${type}`,
          type: 'PENALTY_GIVEN',
          userId: userId,
        },
      });

      await tx.transaction.create({
        data: {
          amount: PENALTY_AMOUNT,
          description: `Recebido por erro do parceiro`,
          type: 'PENALTY_RECEIVED',
          userId: partnerId,
        },
      });

      // 4. Criar a notificação para o parceiro
      await tx.notification.create({
        data: {
          userId: partnerId,
          message: `Seu parceiro, ${user.firstName}, registrou um erro: ${type.toLowerCase()}.`
        }
      });

      // 5. NOVA LÓGICA: Verificar e conceder a conquista de primeiro erro
      const errorCount = await tx.errorLog.count({ where: { userId } });
      if (errorCount === 1) {
        // Usa `skipDuplicates` para segurança, embora a lógica já evite isso.
        await tx.userAchievement.createMany({
          data: [{ userId, type: AchievementType.FIRST_ERROR_LOG }],
          skipDuplicates: true,
        });
      }

      return newErrorLog;
    });

    return result;
  }

  async listByUserId(userId) {
    const logs = await prisma.errorLog.findMany({
      where: { userId },
      orderBy: { erroredAt: 'desc' },
    });
    return logs;
  }
}

module.exports = { errorService: new ErrorService() };