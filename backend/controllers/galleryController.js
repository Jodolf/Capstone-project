import Gallery from '../models/Gallery.js';



// Mostra tutte le gallerie (accessibile a tutti)
const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle gallerie", error });
  }
};

// Mostra solo le gallerie dell'utente loggato
const getOwnedGalleries = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "gallery_owner") {
      return res.status(403).json({ error: "Accesso negato" });
    }

    const galleries = await Gallery.find({ owner: req.user.id });
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero delle gallerie", error });
  }
};

// Crea una nuova galleria e assegna il proprietario
const createGallery = async (req, res) => {
  try {
    console.log("📥 Dati ricevuti dal frontend:", req.body);
    console.log("🧑 Utente autenticato:", req.user);

    if (!req.user || req.user.role !== "gallery_owner") {
      return res.status(403).json({ error: "Accesso negato. Solo i galleristi possono creare gallerie." });
    }

    const { name, location, description, images } = req.body;

    if (!name || !location || !description) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori!" });
    }

    const gallery = new Gallery({
      name,
      location,
      description,
      images,
      owner: req.user.id, // ✅ Usa `req.user.id` (non `_id`)
    });

    await gallery.save();
    console.log("✅ Galleria creata con successo:", gallery);

    res.status(201).json(gallery);
  } catch (error) {
    console.error("❌ ERRORE nella creazione della galleria:", error);
    res.status(500).json({ message: "Errore durante la creazione della galleria", error: error.message });
  }
};

const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 ID della galleria ricevuto:", id); // Debug

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Galleria non trovata" });
    }

    res.json(gallery);
  } catch (error) {
    console.error("❌ Errore nel recupero della galleria:", error);
    res.status(500).json({ message: "Errore nel recupero della galleria" });
  }
};


export { getAllGalleries, createGallery, getOwnedGalleries, getGalleryById };