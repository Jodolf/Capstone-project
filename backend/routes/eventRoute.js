import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';

import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByGallery,
  getEventsByType,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';

const router = express.Router();

// Rotta per creare un nuovo evento (accessibile solo ai galleristi)
router.post('/', authMiddleware, checkRole(['gallery_owner']), createEvent);

// Rotta per ottenere tutti gli eventi
router.get('/', getAllEvents);

// Rotta per ottenere un evento specifico
router.get('/:id', getEventById);

// Rotta per ottenere un evento specifico in base al tipo
router.get("/type", getEventsByType); 

router.get("/gallery/:galleryId", getEventsByGallery);

// Rotta per aggiornare un evento (accessibile solo ai galleristi)
router.put('/:id', authMiddleware, checkRole(['gallery_owner']), updateEvent);

// Rotta per eliminare un evento (accessibile solo ai galleristi)
router.delete('/:id', authMiddleware, checkRole(['gallery_owner']), deleteEvent);

export default router;
