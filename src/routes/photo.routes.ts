// /backend/src/routes/photo.routes.ts

const { Router } = require('express');
const { photoController } = require('../controllers/photo.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

const photoRoutes = Router();
photoRoutes.use(authMiddleware);

photoRoutes.post('/', photoController.upload);
photoRoutes.get('/', photoController.list);
photoRoutes.delete('/:id', photoController.delete);

module.exports = { photoRoutes };