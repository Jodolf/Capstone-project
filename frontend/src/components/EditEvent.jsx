import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "../styles/EditEvent.css";

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
  const [images, setImages] = useState([]); 

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/events/${eventId}`
        );
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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore nell'upload");

      console.log("✅ Immagine caricata:", data.imageUrl);

      setImages((prevImages) => [...prevImages, data.imageUrl]);
    } catch (error) {
      console.error("❌ Errore nell'upload dell'immagine:", error);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem("token");

      const eventData = {
        title,
        description,
        date,
        location,
        type,
        cost,
        latitude,
        longitude,
        images: images.length > 0 ? images : undefined,
      };

      const response = await fetch(
        `http://localhost:3001/api/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) throw new Error("Errore durante l'aggiornamento");

      setSuccessMessage("Evento aggiornato con successo!");
      setTimeout(() => navigate(`/event/${eventId}`), 2000);
    } catch (error) {
      setError("Errore nell'aggiornamento dell'evento");
    }
  };

  return (
    <Container className="edit-event-container">
      <h2>UPDATE EVENT</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {event ? (
        <Form onSubmit={handleUpdateEvent}>
          <Form.Group className="mb-3">
            <Form.Label>TITLE</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>DESCRIPTION</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>DATE</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
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
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="music">MUSIC</option>
              <option value="exhibition">EXHIBITION</option>
              <option value="workshop">WORKSHOP</option>
              <option value="performance">PERFORMANCE</option>
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

          <Form.Group className="mb-3">
            <Form.Label>UPLOAD IMAGE</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Form.Group>
          {/*{images.length > 0 && (
            <div className="image-preview">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:3001${img}`}
                  alt="Anteprima"
                  className="event-image-preview"
                />
              ))}
            </div>
          )}*/}

          <div className="edit-event-buttons">
            <Button type="submit" className="button-primary">
              SAVE
            </Button>
            <Button
              variant="secondary"
              className="button-primary-outline"
              onClick={() => navigate(`/event/${eventId}`)}
            >
              GO BACK
            </Button>
          </div>
        </Form>
      ) : (
        <p>Caricamento in corso...</p>
      )}
    </Container>
  );
};

export default EditEvent;
