// /backend/src/services/achievement.service.ts

const { prisma } = require('../lib/prisma');
const { AchievementType } = require('@prisma/client');

// Definição de todas as conquistas disponíveis no sistema
const ALL_ACHIEVEMENTS = [
  { type: AchievementType.FIRST_WEIGHT_LOG, name: "Primeiro Passo", description: "Você registrou seu primeiro peso!" },
  { type: AchievementType.WEIGHT_LOSS_1KG, name: "Começando a Leveza", description: "Você perdeu seu primeiro quilo!" },
  { type: AchievementType.WEIGHT_LOSS_3KG, name: "Trio Ternura", description: "Parabéns por perder 3 quilos!" },
  { type: AchievementType.WEIGHT_LOSS_5KG, name: "Mão Cheia!", description: "Incrível! 5 quilos a menos na balança." },
  { type: AchievementType.WEIGHT_LOSS_10KG, name: "Dígito Duplo", description: "Você é uma lenda! 10 quilos perdidos." },
  { type: AchievementType.FIRST_ERROR_LOG, name: "Honestidade Brutal", description: "Registrou seu primeiro erro. Reconhecer é o primeiro passo!" },
];

class AchievementService {
  // Função para verificar e conceder conquistas após uma ação
  async checkAndAwardAchievements(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { weightLogs: { orderBy: { logDate: 'desc' } }, achievements: true }
    });
    if (!user) return;

    const unlockedTypes = user.achievements.map(a => a.type);
    const achievementsToCreate = [];

    // --- Lógica de Conquistas de Perda de Peso ---
    if (user.weightLogs.length > 0) {
      const initialWeight = user.initialWeight;
      const currentWeight = user.weightLogs[0].weight;
      const weightLost = initialWeight - currentWeight;

      // Conquista: Primeiro registro de peso
      if (!unlockedTypes.includes(AchievementType.FIRST_WEIGHT_LOG)) {
        achievementsToCreate.push({ userId, type: AchievementType.FIRST_WEIGHT_LOG });
      }

      // Conquistas por quilos perdidos
      if (weightLost >= 1 && !unlockedTypes.includes(AchievementType.WEIGHT_LOSS_1KG)) {
        achievementsToCreate.push({ userId, type: AchievementType.WEIGHT_LOSS_1KG });
      }
      if (weightLost >= 3 && !unlockedTypes.includes(AchievementType.WEIGHT_LOSS_3KG)) {
        achievementsToCreate.push({ userId, type: AchievementType.WEIGHT_LOSS_3KG });
      }
      if (weightLost >= 5 && !unlockedTypes.includes(AchievementType.WEIGHT_LOSS_5KG)) {
        achievementsToCreate.push({ userId, type: AchievementType.WEIGHT_LOSS_5KG });
      }
      if (weightLost >= 10 && !unlockedTypes.includes(AchievementType.WEIGHT_LOSS_10KG)) {
        achievementsToCreate.push({ userId, type: AchievementType.WEIGHT_LOSS_10KG });
      }
    }
    
    // Salva todas as novas conquistas no banco de uma só vez
    if (achievementsToCreate.length > 0) {
      await prisma.userAchievement.createMany({
        data: achievementsToCreate,
        skipDuplicates: true, // Segurança extra
      });
    }
  }

  // Função para listar todas as conquistas e o status do usuário
  async listForUser(userId) {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });
    const unlockedMap = new Map(userAchievements.map(a => [a.type, a.unlockedAt]));

    return ALL_ACHIEVEMENTS.map(achieve => ({
      ...achieve,
      isUnlocked: unlockedMap.has(achieve.type),
      unlockedAt: unlockedMap.get(achieve.type) || null,
    }));
  }
}

module.exports = { achievementService: new AchievementService() };