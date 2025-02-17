import mongoose from "mongoose";
import Event from "../models/Event.js";

// Crea un nuovo evento
const createEvent = async (req, res) => {
  const { title, description, date, location, type, cost, latitude, longitude, gallery } = req.body;
  const owner = req.user.id; // 🔥 Assicuriamoci di salvare l'owner

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
      owner, // 🔥 Assicuriamoci che l'owner venga salvato
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
      .populate("owner", "_id name"); // 🔥 Assicuriamoci che l'owner sia caricato correttamente

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
  const { type } = req.query; // Recupera il parametro 'type' dalla query string

  try {
    // Verifica che il tipo sia stato fornito
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

// Aggiorna un evento
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    let event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    console.log("🔍 Proprietario evento:", event.owner ? event.owner.toString() : "Nessun owner");
    console.log("🔑 Utente loggato:", userId);

    // 🔥 Controllo: solo il proprietario dell'evento può modificarlo
    if (!event.owner || event.owner.toString() !== userId) {
      console.error("❌ Tentativo di modifica non autorizzato!");
      return res.status(403).json({ message: "Non sei autorizzato a modificare questo evento" });
    }

    event = await Event.findByIdAndUpdate(id, { ...req.body }, { new: true, runValidators: true });

    res.status(200).json(event);
  } catch (error) {
    console.error("❌ Errore durante l'aggiornamento dell'evento:", error);
    res.status(500).json({ message: "Errore durante l'aggiornamento dell'evento", error });
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
  updateEvent,
  deleteEvent,
};
