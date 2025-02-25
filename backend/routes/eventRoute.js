import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import multer from "multer";

import {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByGallery,
  getEventsByType,
  uploadEventImage,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

router.post("/uploads", upload.single("image"), uploadEventImage);

// Rotta per aggiornare un evento (accessibile solo ai galleristi)
router.put('/:id', authMiddleware, checkRole(['gallery_owner']), updateEvent);

// Rotta per eliminare un evento (accessibile solo ai galleristi)
router.delete('/:id', authMiddleware, checkRole(['gallery_owner']), deleteEvent);

export default router;
