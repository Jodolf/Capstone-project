import mongoose from "mongoose";
import Event from "../models/Event.js";

// Crea un nuovo evento
const createEvent = async (req, res) => {
  const { title, description, date, location, type, cost, latitude, longitude, gallery } = req.body;
  const owner = req.user.id; 

  try {
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      type,
      cost,
      latitude,
      longitude,
      gallery,
      owner, 
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Errore durante la creazione dell'evento", error: error.message });
  }
};

// Ottieni tutti gli eventi
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("gallery", "name location");
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante il recupero degli eventi", error });
  }
};

// Ottieni un evento specifico
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id)
      .populate("gallery", "name location")
      .populate("owner", "_id name"); 

    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    console.log("📌 Evento recuperato dal database:", event);
    console.log("🔍 Owner dell'evento nel database:", event.owner);

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Errore durante il recupero dell'evento", error });
  }
};

// Ottieni eventi filtrati per tipo
const getEventsByType = async (req, res) => {
  const { type } = req.query; 

  try {
    
    if (!type) {
      return res
        .status(400)
        .json({
          message: "Il tipo di evento è obbligatorio per questo endpoint",
        });
    }

    // Filtra gli eventi in base al tipo
    const events = await Event.find({ type }).populate(
      "gallery",
      "name location"
    );
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Errore durante il recupero degli eventi per tipo",
        error,
      });
  }
};

// Ottieni tutti gli eventi di una specifica galleria
const getEventsByGallery = async (req, res) => {
  try {
    const { galleryId } = req.params;

    console.log("🔍 ID ricevuto per il recupero eventi:", galleryId);

    if (!mongoose.Types.ObjectId.isValid(galleryId)) {
      console.error("❌ ID galleria non valido:", galleryId);
      return res.status(400).json({ message: "ID galleria non valido" });
    }

    const events = await Event.find({ gallery: galleryId }).populate(
      "gallery",
      "name location"
    );

    console.log("📦 Eventi trovati:", events);

    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Errore nel recupero eventi:", error);
    res
      .status(500)
      .json({
        message: "Errore durante il recupero degli eventi",
        error: error.message,
      });
  }
};

const uploadEventImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nessun file caricato!" });
  }

  console.log("📷 Immagine caricata:", req.file.filename);
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
};

// Aggiorna un evento
const updateEvent = async (req, res) => {
  try {
      const { title, description, date, location, latitude, longitude, type, cost, images } = req.body;

     
      const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          {
              title,
              description,
              date,
              location,
              latitude,
              longitude,
              type,
              cost,
              $push: { images: { $each: images || [] } }, 
          },
          { new: true }
      );

      if (!updatedEvent) {
          return res.status(404).json({ message: "Evento non trovato" });
      }

      res.json(updatedEvent);
  } catch (error) {
      console.error("Errore nell'aggiornamento dell'evento:", error);
      res.status(500).json({ message: "Errore interno del server" });
  }
};

// Elimina un evento
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    res.status(200).json({ message: "Evento eliminato con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante l'eliminazione dell'evento", error });
  }
};

export {
  createEvent,
  getAllEvents,
  getEventById,
  getEventsByType,
  getEventsByGallery,

  uploadEventImage,
  
  updateEvent,
  deleteEvent,
};
