import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/events/${eventId}`
        );
        if (!response.ok) throw new Error("Evento non trovato");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          date: event.date,
          endDate: event.endDate || "",
          location: event.location,
          type: event.type,
          cost: event.cost || 0, // Assicuriamoci che `cost` sia presente
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore durante l'aggiornamento");
  
      setEvent(data);
      setSuccessMessage("Evento aggiornato con successo!"); // Mostra un messaggio di successo
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <Container className="mt-4">
      <h2>Modifica Evento</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}

      {event && (
        <Form onSubmit={handleUpdateEvent}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo Evento</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={event.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={event.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data Inizio</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={event.date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data Fine</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={event.endDate || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Posizione</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={event.location}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo Evento</Form.Label>
            <Form.Select
              name="type"
              value={event.type}
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
              value={event.cost || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button type="submit">Aggiorna Evento</Button>
        </Form>
      )}
    </Container>
  );
};

export default EventDetails;
