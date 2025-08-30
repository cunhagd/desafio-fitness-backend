// /backend/src/controllers/invite.controller.ts

const { inviteService } = require('../services/invite.service');

class InviteController {
  // Envia um convite de um usuário para um email
  async send(req, res) {
    const { invitedEmail } = req.body;
    const senderId = req.userId;
    try {
      await inviteService.sendInvitation(senderId, invitedEmail);
      return res.status(200).json({ message: 'Convite enviado com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Busca convites pendentes para o usuário logado
  async getPending(req, res) {
    const userId = req.userId;
    try {
      const invitations = await inviteService.getPendingInvitations(userId);
      return res.json(invitations);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Responde a um convite (aceitando ou recusando)
  async respond(req, res) {
    const { invitationId, acceptance } = req.body;
    const userId = req.userId;
    try {
      await inviteService.respondToInvitation(invitationId, userId, acceptance);
      const message = acceptance ? 'Convite aceito!' : 'Convite recusado.';
      return res.status(200).json({ message });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Verifica o status de parceria do usuário logado
  async getStatus(req, res) {
    try {
      const status = await inviteService.getPartnerStatus(req.userId);
      return res.json(status);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  // Remove a parceria atual
  async remove(req, res) {
    const userId = req.userId;
    try {
      await inviteService.removePartner(userId);
      return res.status(200).json({ message: 'Parceria removida com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = { inviteController: new InviteController() };