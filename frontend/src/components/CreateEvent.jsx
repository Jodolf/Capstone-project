import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const CreateEvent = ({ onEventCreated, galleries = [] }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("exhibition"); // Imposta un valore predefinito
  const [cost, setCost] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, gallery, date, location }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Errore nella creazione dell'evento");

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      onEventCreated(data);
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error);
    }
  };

  return (
    <>
      {showAlert && (
        <Alert variant="success">Evento creato con successo!</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Descrizione</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Galleria</Form.Label>
          <Form.Select
            value={gallery}
            onChange={(e) => setGallery(e.target.value)}
            required
          >
            <option value="">Seleziona una galleria</option>
            {galleries.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Titolo Evento</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Data Evento</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Posizione</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tipo Evento</Form.Label>
          <Form.Select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            value={cost}
            onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
            required
          />
        </Form.Group>

        <Button type="submit">Crea</Button>
      </Form>
    </>
  );
};

export default CreateEvent;
