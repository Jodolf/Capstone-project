import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Il titolo dell'evento è obbligatorio
    trim: true,
  },
  description: {
    type: String,
    required: true, // La descrizione dell'evento è obbligatoria
    trim: true,
  },
  gallery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery', // Collegamento al modello "Gallery"
    required: true,
  },
  date: {
    type: Date,
    required: true, // La data dell'evento è obbligatoria
  },
  endDate: {
    type: Date, // (Opzionale) La data di fine evento
  },
  location: {
    type: String,
    required: true, // La posizione può essere diversa da quella della galleria
  },
    latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["exhibition", "performance", "music", "workshop"], // Tipi di evento accettati
    required: true, // Campo obbligatorio
  },
  images: {
    type: [String], // Array di URL di immagini relative all'evento
  },
  cost: {
    type: Number, // Costo dell'evento
    default: 0, // Impostato a 0 per eventi gratuiti
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 🔥 Collegamento all'utente proprietario
    required: true, // 🔥 Assicuriamoci che tutti gli eventi abbiano un owner
  },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
