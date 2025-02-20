import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  getUserProfile,
  saveEvent,
  removeSavedEvent,
  getSavedEvents,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

//UTENTE
// Registrazione utente
router.post("/register", registerUser);
// Login utente
router.post("/login", loginUser);
// Profilo utente autenticato
router.get("/profile", authMiddleware, getUserProfile);
router.put("/update-profile", authMiddleware, updateUserProfile);

//PREFERITI
// Salva un evento
router.post("/save-event", authMiddleware, saveEvent);
// Rimuovi un evento salvato
router.delete("/remove-event", authMiddleware, removeSavedEvent);
// Recupera tutti gli eventi salvati
router.get("/saved-events", authMiddleware, getSavedEvents);

export default router;
