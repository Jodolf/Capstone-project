import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, ListGroup, Form, Button, Alert } from "react-bootstrap";
import CreateEvent from "../components/CreateEvent";

const ManageGallery = () => {
  const { id: galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

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
          body: JSON.stringify({ name, description, location }),
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
    <Container className="mt-4">
      <h2>Gestione Galleria</h2>
      {gallery ? (
        <>
          <h3>{gallery.name}</h3>
          <p>Posizione: {gallery.location}</p>

          {/* Form per Modificare la Galleria */}
          <h3>Modifica Galleria</h3>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleUpdateGallery}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Galleria</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Posizione</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit">Salva Modifiche</Button>
          </Form>

          {/* Pulsante per Eliminare la Galleria */}
          <Button
            variant="danger"
            className="mt-3"
            onClick={handleDeleteGallery}
          >
            🗑 Elimina Galleria
          </Button>
        </>
      ) : (
        <p>Caricamento della galleria...</p>
      )}

      <h3>Eventi Associati</h3>
      {events.length > 0 ? (
        <ListGroup>
          {events.map((event) => (
            <ListGroup.Item key={event._id}>
              <Link
                to={`/event/${event._id}`}
                style={{ textDecoration: "none" }}
              >
                <strong>{event.title}</strong> -{" "}
                {new Date(event.date).toLocaleDateString()}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Nessun evento trovato.</p>
      )}

      {gallery && (
        <>
          <h3>Crea un Nuovo Evento</h3>
          <CreateEvent 
  onEventCreated={(newEvent) => setEvents([...events, newEvent])} 
  galleryId={gallery._id} 
/>
        </>
      )}
    </Container>
  );
};

export default ManageGallery;
