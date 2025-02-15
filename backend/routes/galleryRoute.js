import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {  } from '../controllers/galleryController.js';

import { getAllGalleries, createGallery, getOwnedGalleries, getGalleryById  } from '../controllers/galleryController.js';

const router = express.Router();

// Rotte per tutti gli utenti
router.get('/', getAllGalleries);

router.get("/owned", authMiddleware, getOwnedGalleries);

// Rotte riservate ai galleristi
router.post('/', authMiddleware, checkRole(['gallery_owner']), createGallery);

router.get("/:id", getGalleryById); // ✅ Deve essere registrata correttamente

export default router; // Esportiamo il router
