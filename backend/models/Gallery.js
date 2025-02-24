import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery; // Esportiamo il modello
