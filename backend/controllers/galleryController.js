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
    console.log("🔑 Utente autenticato:", req.user);

    if (!req.user || req.user.role !== "gallery_owner") {
      return res.status(403).json({ error: "Accesso negato" });
    }

    const galleries = await Gallery.find({ owner: req.user.id });
    console.log("📥 Gallerie trovate:", galleries);

    res.status(200).json(galleries);
  } catch (error) {
    console.error("❌ Errore nel recupero delle gallerie:", error);
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

const updateGallery = async (req, res) => {
  const { id } = req.params;
  const { name, description, location } = req.body;

  try {
    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { name, description, location },
      { new: true, runValidators: true }
    );

    if (!updatedGallery) {
      return res.status(404).json({ message: "Galleria non trovata" });
    }

    res.status(200).json(updatedGallery);
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'aggiornamento della galleria", error });
  }
};

const deleteGallery = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return res.status(404).json({ message: "Galleria non trovata" });
    }

    res.status(200).json({ message: "Galleria eliminata con successo" });
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'eliminazione della galleria", error });
  }
};


export { getAllGalleries, createGallery, getOwnedGalleries, getGalleryById, updateGallery, deleteGallery };