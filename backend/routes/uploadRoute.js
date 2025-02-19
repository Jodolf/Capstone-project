import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import path from "path";

const router = express.Router();

// Endpoint per l'upload delle immagini
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Errore durante il caricamento dell'immagine" });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });

  // 🔥 Restituisce il percorso dell'immagine
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Servire i file statici dalla cartella uploads
router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

export default router;