import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Registrazione utente
router.post('/register', registerUser);

// Login utente
router.post('/login', loginUser);

// Profilo utente autenticato
router.get('/profile', authMiddleware, getUserProfile);

export default router;
