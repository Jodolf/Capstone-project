import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import { uploadGalleryImage } from '../controllers/galleryController.js';
import multer from "multer";

import { getAllGalleries, createGallery, getOwnedGalleries, getGalleryById, updateGallery, deleteGallery } from '../controllers/galleryController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // 📂 Cartella dove salvare le immagini
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage });
  

const router = express.Router();

// Rotte per tutti gli utenti
router.get('/', getAllGalleries);

router.get("/owned", authMiddleware, getOwnedGalleries);

// Rotte riservate ai galleristi
router.post('/', authMiddleware, checkRole(['gallery_owner']), createGallery);

router.get("/:id", getGalleryById);
router.put("/:id", updateGallery);
router.delete("/:id", deleteGallery); // Rotta per eliminare la galleria
router.post("/uploads", upload.single("image"), uploadGalleryImage);


export default router; // Esportiamo il router
