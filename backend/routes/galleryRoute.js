import express from 'express';
import { getAllGalleries, createGallery } from '../controllers/galleryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';

const router = express.Router();

// Rotte per tutti gli utenti
router.get('/', getAllGalleries);

// Rotte riservate ai galleristi
router.post('/', authMiddleware, checkRole(['gallery_owner']), createGallery);

export default router; // Esportiamo il router
