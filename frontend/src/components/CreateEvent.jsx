import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const CreateEvent = ({ onEventCreated, galleryId  = null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState("exhibition"); // Imposta un valore predefinito
  const [cost, setCost] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!galleryId) {
      console.error("❌ Errore: ID galleria non disponibile.");
      return;
    }
  
    const eventData = {
      title,
      description,
      gallery: galleryId,
      date,
      location,
      type,
      cost,
      latitude,
      longitude,
    };
  
    console.log("📌 Dati inviati nella richiesta:", eventData); // Debug
  
    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData), // 🔥 Assicuriamoci che il body sia costruito correttamente
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore nella creazione dell'evento");
  
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
        <Alert variant="success">EVENT CREATED</Alert>
      )}
      <Form onSubmit={handleSubmit}>
      <Form.Group>
          <Form.Label>TITLE</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>DESCRIPTION</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>


        <Form.Group>
          <Form.Label>DATE</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>POSITION</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>LATITUDE</Form.Label>
          <Form.Control
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>LONGITUDE</Form.Label>
          <Form.Control
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>KIND</Form.Label>
          <Form.Select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="exhibition">EXHIBITION</option>
            <option value="performance">PERFORMANCE</option>
            <option value="music">MUSIC</option>
            <option value="workshop">WORKSHOP</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>COST (€)</Form.Label>
          <Form.Control
            type="number"
            value={cost}
            onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
            required
          />
        </Form.Group>

        <div className="edit-event-buttons">
          <Button type="submit" className="button-primary">
            CREATE
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateEvent;
