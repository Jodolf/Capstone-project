import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import {  } from '../controllers/galleryController.js';

import { getAllGalleries, createGallery, getOwnedGalleries, getGalleryById, updateGallery, deleteGallery } from '../controllers/galleryController.js';

const router = express.Router();

// Rotte per tutti gli utenti
router.get('/', getAllGalleries);

router.get("/owned", authMiddleware, getOwnedGalleries);

// Rotte riservate ai galleristi
router.post('/', authMiddleware, checkRole(['gallery_owner']), createGallery);

router.get("/:id", getGalleryById); // ✅ Deve essere registrata correttamente
router.put("/:id", updateGallery);
router.delete("/:id", deleteGallery); // Rotta per eliminare la galleria


export default router; // Esportiamo il router
