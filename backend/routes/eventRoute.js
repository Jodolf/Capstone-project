import express from 'express';

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';

const router = express.Router();

// Rotta per creare un nuovo evento (accessibile solo ai galleristi)
router.post('/', authMiddleware, checkRole(['gallery_owner']), createEvent);

// Rotta per ottenere tutti gli eventi
router.get('/', getAllEvents);

// Rotta per ottenere un evento specifico
router.get('/:id', getEventById);

// Rotta per aggiornare un evento (accessibile solo ai galleristi)
router.put('/:id', authMiddleware, checkRole(['gallery_owner']), updateEvent);

// Rotta per eliminare un evento (accessibile solo ai galleristi)
router.delete('/:id', authMiddleware, checkRole(['gallery_owner']), deleteEvent);

export default router;
