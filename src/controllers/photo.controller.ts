// /backend/src/controllers/photo.controller.ts

const { photoService } = require('../services/photo.service');

class PhotoController {
  async upload(req, res) {
    try {
      // MUDANÇA: Agora esperamos um array de URLs
      const { imageUrls } = req.body;
      const newPhotos = await photoService.create(req.userId, imageUrls);
      return res.status(201).json(newPhotos);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async list(req, res) {
    try {
      const photos = await photoService.listByUserId(req.userId);
      return res.json(photos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await photoService.delete(id, req.userId);
      return res.status(200).json({ message: 'Foto deletada com sucesso.' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = { photoController: new PhotoController() };