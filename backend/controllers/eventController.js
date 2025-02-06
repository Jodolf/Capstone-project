import Event from '../models/Event.js';

// Crea un nuovo evento
const createEvent = async (req, res) => {
  const { title, description, gallery, date, endDate, location, images, cost } = req.body;

  try {
    const newEvent = new Event({
      title,
      description,
      gallery,
      date,
      endDate,
      location,
      images,
      cost,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la creazione dell\'evento', error });
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

// Aggiorna un evento
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, endDate, location, images, cost } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, endDate, location, images, cost },
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
export const deleteEvent = async (req, res) => {
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

export default { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };