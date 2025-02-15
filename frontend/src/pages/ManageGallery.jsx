import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const ManageGallery = () => {
  const { galleryId } = useParams();
  const [gallery, setGallery] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    type: "exhibition",
    location: "",
    cost: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/galleries/${galleryId}`
        );
        const data = await response.json();
        setGallery(data);
      } catch (error) {
        console.error("Errore nel recupero della galleria:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/events?gallery=${galleryId}`
        );
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Errore nel recupero degli eventi:", error);
      }
    };

    fetchGallery();
    fetchEvents();
  }, [galleryId]);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...newEvent,
          gallery: galleryId, // Associa automaticamente l'evento alla galleria
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Errore nella creazione dell'evento");

      setSuccessMessage("Evento creato con successo!");
      setEvents([...events, data]); // Aggiorna la lista degli eventi mostrata nella UI
      setNewEvent({
        title: "",
        description: "",
        date: "",
        endDate: "",
        type: "exhibition",
        location: "",
        cost: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  if (!gallery) return <p>Caricamento...</p>;

  return (
    <Container className="mt-4">
      <h2>Gestisci {gallery.name}</h2>

      {/* Form per la modifica della galleria */}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" value={gallery.name} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Posizione</Form.Label>
          <Form.Control type="text" value={gallery.location} readOnly />
        </Form.Group>
      </Form>

      {/* Lista degli eventi */}
      <h3>Eventi</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <Link to={`/event/${event._id}`}>
              {event.title} - {event.date}
            </Link>
          </li>
        ))}
      </ul>

      {/* Form separato per la creazione di un evento */}
      <h3>Aggiungi un Nuovo Evento</h3>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}

      <Form onSubmit={handleCreateEvent}>
        <Form.Group>
          <Form.Label>Galleria</Form.Label>
          <Form.Control type="text" value={galleryId} readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Titolo Evento</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descrizione</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data Inizio</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Data Fine</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={newEvent.endDate}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Posizione</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tipo Evento</Form.Label>
          <Form.Select
            name="type"
            value={newEvent.type}
            onChange={handleInputChange}
          >
            <option value="exhibition">Exhibition</option>
            <option value="performance">Performance</option>
            <option value="music">Music</option>
            <option value="workshop">Workshop</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Costo (€)</Form.Label>
          <Form.Control
            type="number"
            name="cost"
            value={newEvent.cost}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button type="submit">Crea Evento</Button>
      </Form>
    </Container>
  );
};
export default ManageGallery;
