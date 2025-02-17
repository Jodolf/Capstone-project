import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [cost, setCost] = useState(0);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/events/${eventId}`);
        if (!response.ok) throw new Error("Evento non trovato");
        const data = await response.json();
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description);
        setDate(data.date.split("T")[0]); // Formatta la data per l'input
        setLocation(data.location);
        setType(data.type);
        setCost(data.cost);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      } catch (error) {
        setError("Errore nel recupero dell'evento");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, date, location, type, cost, latitude, longitude }),
      });

      if (!response.ok) throw new Error("Errore durante l'aggiornamento");

      setSuccessMessage("Evento aggiornato con successo!");
      setTimeout(() => navigate(`/event/${eventId}`), 2000); // Torna alla pagina evento dopo 2s
    } catch (error) {
      setError("Errore nell'aggiornamento dell'evento");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Modifica Evento</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {event ? (
        <Form onSubmit={handleUpdateEvent}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data</Form.Label>
            <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Posizione</Form.Label>
            <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Latitudine</Form.Label>
            <Form.Control type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Longitudine</Form.Label>
            <Form.Control type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="music">Musica</option>
              <option value="exhibition">Mostra</option>
              <option value="workshop">Workshop</option>
              <option value="performance">Performance</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Costo (€)</Form.Label>
            <Form.Control type="number" value={cost} onChange={(e) => setCost(parseFloat(e.target.value) || 0)} required />
          </Form.Group>

          <Button type="submit" className="button-primary">Salva Modifiche</Button>
          <Button variant="secondary" className="ms-2" onClick={() => navigate(`/event/${eventId}`)}>Annulla</Button>
        </Form>
      ) : (
        <p>Caricamento in corso...</p>
      )}
    </Container>
  );
};

export default EditEvent;
