import Event from '../models/Event.js';

// Crea un nuovo evento
const createEvent = async (req, res) => {
  const { title, description, gallery, date, endDate, location, type, images, cost } = req.body;

  try {
    console.log(" Dati ricevuti dal frontend:", req.body); //  Log per vedere i dati ricevuti

    const newEvent = new Event({
      title,
      description,
      gallery,
      date,
      endDate,
      location,
      type, 
      images,
      cost,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("ERRORE durante la creazione dell'evento:", error); // Log dettagliato
    res.status(500).json({ message: "Errore durante la creazione dell'evento", error: error.message });
  }
};

// Ottieni tutti gli eventi
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('gallery', 'name location');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero degli eventi', error });
  }
};

// Ottieni un evento specifico
const getEventById = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).populate('gallery', 'name location');
    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dell\'evento', error });
  }
};

// Ottieni eventi filtrati per tipo
const getEventsByType = async (req, res) => {
  const { type } = req.query; // Recupera il parametro 'type' dalla query string

  try {
    // Verifica che il tipo sia stato fornito
    if (!type) {
      return res.status(400).json({ message: 'Il tipo di evento è obbligatorio per questo endpoint' });
    }

    // Filtra gli eventi in base al tipo
    const events = await Event.find({ type }).populate('gallery', 'name location');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero degli eventi per tipo', error });
  }
};


// Aggiorna un evento
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, endDate, location, images, cost } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, endDate, location, type, images, cost },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'evento', error });
  }
};

// Elimina un evento
const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Evento non trovato' });
    }

    res.status(200).json({ message: 'Evento eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'evento', error });
  }
};

export { createEvent, getAllEvents, getEventById, getEventsByType, updateEvent, deleteEvent };