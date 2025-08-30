// /backend/src/services/invite.service.ts

const { prisma } = require('../lib/prisma');

class InviteService {
  async sendInvitation(senderId, invitedEmail) {
    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    if (!sender) throw new Error('Usuário remetente não encontrado.');
    if (sender.partnerId) throw new Error('Você já tem um parceiro de desafio.');
    if (sender.email === invitedEmail) throw new Error('Você não pode convidar a si mesmo.');

    const invitedUser = await prisma.user.findUnique({ where: { email: invitedEmail } });
    if (!invitedUser) throw new Error('O email convidado não corresponde a um usuário cadastrado.');
    if (invitedUser.partnerId) throw new Error('Este usuário já tem um parceiro.');
    
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        senderId: senderId,
        invitedEmail: invitedEmail,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      await prisma.invitation.delete({ where: { id: existingInvitation.id } });
    }

    await prisma.invitation.create({
      data: {
        senderId,
        invitedEmail,
      },
    });
  }

  async getPendingInvitations(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    const invitations = await prisma.invitation.findMany({
      where: {
        invitedEmail: user.email,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            firstName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return invitations;
  }

  async respondToInvitation(invitationId, userId, accepted) {
    const invitation = await prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation || invitation.status !== 'PENDING') {
      throw new Error('Convite inválido ou já respondido.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.email !== invitation.invitedEmail) {
      throw new Error('Este convite não é para você.');
    }
    if (user.partnerId) {
      throw new Error('Você já tem um parceiro. Remova o atual para aceitar um novo convite.');
    }

    if (accepted) {
      const senderId = invitation.senderId;
      await prisma.$transaction(async (tx) => {
        await tx.user.update({ where: { id: userId }, data: { partnerId: senderId } });
        await tx.user.update({ where: { id: senderId }, data: { partnerId: userId } });
        await tx.invitation.update({ where: { id: invitationId }, data: { status: 'ACCEPTED' } });
        await tx.invitation.updateMany({
          where: {
            invitedEmail: user.email,
            status: 'PENDING',
          },
          data: { status: 'DECLINED' },
        });
      });
    } else {
      await prisma.invitation.update({
        where: { id: invitationId },
        data: { status: 'DECLINED' },
      });
    }
  }

  async getPartnerStatus(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true },
    });
    if (user?.partnerId) {
      const partner = await prisma.user.findUnique({
        where: { id: user.partnerId },
        select: { firstName: true, email: true },
      });
      return { hasPartner: true, partner };
    }
    return { hasPartner: false, partner: null };
  }

  async removePartner(userId) {
    const userWithPartner = await prisma.user.findUnique({
      where: { id: userId },
      select: { partnerId: true, email: true },
    });

    if (!userWithPartner || !userWithPartner.partnerId) {
      throw new Error('Você não tem um parceiro para remover.');
    }

    const partner = await prisma.user.findUnique({
        where: { id: userWithPartner.partnerId },
        select: { email: true },
    });

    if (!partner) {
        // Se o parceiro não existir por algum motivo, limpa apenas o lado do usuário
        await prisma.user.update({ where: { id: userId }, data: { partnerId: null } });
        return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { partnerId: null } });
      await tx.user.update({ where: { id: userWithPartner.partnerId }, data: { partnerId: null } });
      await tx.invitation.deleteMany({
        where: {
          OR: [
            { senderId: userId, invitedEmail: partner.email },
            { senderId: userWithPartner.partnerId, invitedEmail: userWithPartner.email },
          ],
        },
      });
    });
  }
}

module.exports = { inviteService: new InviteService() };