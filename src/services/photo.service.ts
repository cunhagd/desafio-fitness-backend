// /backend/src/services/photo.service.ts

const { prisma } = require('../lib/prisma');

class PhotoService {
  // MUDANÇA: Agora aceita um array de imageUrls
  async create(userId, imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      throw new Error('Nenhuma imagem fornecida.');
    }

    // Prepara os dados para o createMany
    const photosToCreate = imageUrls.map(url => ({
      userId,
      imageUrl: url,
    }));

    // Usa createMany para inserir todas as fotos em uma única operação
    const result = await prisma.progressPhoto.createMany({
      data: photosToCreate,
    });

    return result; // Retorna a contagem de fotos criadas
  }

  async listByUserId(userId) {
    return await prisma.progressPhoto.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(photoId, userId) {
    const photo = await prisma.progressPhoto.findUnique({
      where: { id: photoId },
    });
    if (!photo) {
      throw new Error('Foto não encontrada.');
    }
    if (photo.userId !== userId) {
      throw new Error('Acesso negado. Você não pode deletar esta foto.');
    }
    await prisma.progressPhoto.delete({
      where: { id: photoId },
    });
  }
}

module.exports = { photoService: new PhotoService() };