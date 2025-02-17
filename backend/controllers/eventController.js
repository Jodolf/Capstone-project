import mongoose from "mongoose";
import Event from "../models/Event.js";

// Crea un nuovo evento
const createEvent = async (req, res) => {
  const { title, description, date, location, type, cost, latitude, longitude, gallery } = req.body;
  const owner = req.user.id;

  console.log("📌 Dati ricevuti dal frontend:", req.body);

  try {
    if (!gallery) {
      console.error("❌ ID galleria mancante nel backend!");
      return res.status(400).json({ message: "ID galleria mancante" });
    }

    if (!mongoose.Types.ObjectId.isValid(gallery)) {
      console.error("❌ ID galleria non valido!");
      return res.status(400).json({ message: "ID galleria non valido" });
    }

    const galleryObjectId = new mongoose.Types.ObjectId(gallery);

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      type,
      cost,
      latitude,
      longitude,
      gallery: galleryObjectId,
      owner,
    });

    const savedEvent = await newEvent.save();
    console.log("✅ Evento salvato con successo:", savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("❌ Errore durante la creazione dell'evento:", error);
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
    const event = await Event.findById(id).populate("gallery", "name location");
    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }
    res.status(200).json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore durante il recupero dell'evento", error });
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
  const { title, description, date, endDate, location, type, cost } = req.body;

  try {
    console.log("🔍 Dati ricevuti per l'aggiornamento:", req.body); // <-- Debug

    // Controlliamo se l'evento esiste prima di aggiornare
    let event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento non trovato" });
    }

    // Controlliamo che tutti i campi necessari siano presenti
    if (!title || !description || !date || !location || !type) {
      return res
        .status(400)
        .json({ message: "Tutti i campi sono obbligatori" });
    }

    // Se `cost` è vuoto o non è un numero, settiamo a 0
    const eventCost = cost ? parseFloat(cost) : 0;

    event = await Event.findByIdAndUpdate(
      id,
      { title, description, date, endDate, location, type, cost: eventCost },
      { new: true, runValidators: true }
    );

    res.status(200).json(event);
  } catch (error) {
    console.error("❌ Errore durante l'aggiornamento:", error);
    res
      .status(500)
      .json({ message: "Errore durante l'aggiornamento dell'evento", error });
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
