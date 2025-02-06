import Gallery from '../models/Gallery.js';

// Restituisce tutte le gallerie
const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching galleries' });
  }
};

// Crea una nuova galleria
const createGallery = async (req, res) => {
  try {
    const gallery = new Gallery(req.body);
    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ error: 'Error creating gallery' });
  }
};

export { getAllGalleries, createGallery };