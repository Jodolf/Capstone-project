import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  images: [String],
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery; // Esportiamo il modello
