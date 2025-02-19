import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, ListGroup, Form, Button, Alert } from "react-bootstrap";
import CreateEvent from "../components/CreateEvent";
import "../styles/ManageGallery.css";

const ManageGallery = () => {
  const { id: galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]); // 🔥 Definiamo lo stato per le immagini

  useEffect(() => {
    const fetchGalleryAndEvents = async () => {
      if (!galleryId) {
        console.error("❌ Nessun ID di galleria fornito.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ Nessun token trovato.");
          return;
        }

        // Recupera dettagli della galleria
        const galleryResponse = await fetch(
          `http://localhost:3001/api/galleries/${galleryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!galleryResponse.ok)
          throw new Error("Errore nel recupero della galleria");
        const galleryData = await galleryResponse.json();
        setGallery(galleryData);
        setName(galleryData.name);
        setDescription(galleryData.description);
        setLocation(galleryData.location);
        setLatitude(galleryData.latitude);
        setLongitude(galleryData.longitude);

        // Recupera eventi associati alla galleria
        const eventsResponse = await fetch(
          `http://localhost:3001/api/events/gallery/${galleryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!eventsResponse.ok)
          throw new Error("Errore nel recupero degli eventi");
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error("❌ Errore:", error);
      }
    };

    fetchGalleryAndEvents();
  }, [galleryId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "http://localhost:3001/api/galleries/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Errore durante l'upload");

      console.log("✅ Immagine caricata con successo:", data.imageUrl);
      setImages((prevImages) => [...prevImages, data.imageUrl]);
    } catch (error) {
      console.error("❌ Errore nell'upload dell'immagine:", error);
    }
  };

  // Funzione per aggiornare la galleria
  const handleUpdateGallery = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/galleries/${gallery._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            description,
            location,
            latitude,
            longitude,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Errore durante l'aggiornamento");

      setSuccessMessage("Galleria aggiornata con successo!");
      setGallery(data);
    } catch (error) {
      setError("Errore durante l'aggiornamento della galleria");
      console.error(error);
    }
  };

  // Funzione per eliminare la galleria
  const handleDeleteGallery = async () => {
    if (
      !window.confirm(
        "Sei sicuro di voler eliminare questa galleria? Questa azione è irreversibile."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/galleries/${gallery._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Errore durante l'eliminazione della galleria");

      alert("Galleria eliminata con successo!");
      navigate("/manage-galleries"); // Reindirizza alla lista delle gallerie
    } catch (error) {
      console.error("Errore durante l'eliminazione della galleria:", error);
    }
  };

  return (
    <Container className="manage-gallery-container">
      {gallery ? (
        <>
          <div className="manage-gallery-layout">
            {/* 📌 Sezione Sinistra: Gestione Galleria */}
            <div className="manage-gallery-section">
              <h2>MANAGE GALLERY</h2>
              {successMessage && <Alert variant="success">{successMessage}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
  
              <Form onSubmit={handleUpdateGallery}>
                <Form.Group className="mb-3">
                  <Form.Label>NAME</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <Form.Label>UPLOAD IMAGE</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Form.Group>
  
                <div className="edit-event-buttons">
                  <Button type="submit" className="button-primary">SAVE</Button>
                  <Button className="button-primary-outline" onClick={handleDeleteGallery}>DELETE</Button>
                </div>
              </Form>
            </div>
  
            {/* 📌 Sezione Destra: Creazione Nuovo Evento */}
            <div className="create-event-section">
              <h2>CREATE NEW EVENT</h2>
              <CreateEvent onEventCreated={(newEvent) => setEvents([...events, newEvent])} galleryId={gallery._id} />
            </div>
          </div>

          <h2>GALLERY EVENTS</h2>
          {/* 📌 Sezione Bassa: Lista Eventi della Galleria */}
          <div className="manage-gallery-events-list">
            {events.length > 0 ? (
              <ul>
                {events.map((event) => (
                  <li key={event._id}>
                    <Link to={`/event/${event._id}`} className="manage-gallery-event-link" style={{ textDecoration: "none" }}>
                      <strong>{event.title}</strong> -{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>NO EVENT FOUND.</p>
            )}
          </div>
        </>
      ) : (
        <p>LOADING...</p>
      )}
    </Container>
  );
  };

export default ManageGallery;
