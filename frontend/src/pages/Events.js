import React, { useState, useEffect } from "react";
import { Card, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { FaRegEye, FaEye } from "react-icons/fa"; // Icone occhio
import { useNavigate } from "react-router-dom";

import "../styles/Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState(new Set()); // Usiamo un Set per gestire i preferiti
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  useEffect(() => {
    // Fetch eventi
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Errore nel recupero degli eventi", error);
      }
    };

    fetchEvents();

    // Se l'utente è loggato, recupera i preferiti
    if (isAuthenticated) {
      const fetchSavedEvents = async () => {
        try {
          const response = await fetch(
            "http://localhost:3001/api/users/saved-events",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          setSavedEvents(new Set(data.map((event) => event._id))); // Salviamo gli ID degli eventi preferiti
        } catch (error) {
          console.error("Errore nel recupero degli eventi salvati", error);
        }
      };
      fetchSavedEvents();
    }
  }, [isAuthenticated, token]);

  // Funzione per salvare/rimuovere un evento dai preferiti
  const toggleFavorite = async (eventId) => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    const isSaved = savedEvents.has(eventId);
    const endpoint = isSaved ? "remove-event" : "save-event";
    const method = isSaved ? "DELETE" : "POST";

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${endpoint}`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        }
      );

      if (!response.ok) throw new Error("Errore nella gestione dei preferiti");

      // Aggiorniamo lo stato dei preferiti
      setSavedEvents((prev) => {
        const updated = new Set(prev);
        if (isSaved) updated.delete(eventId);
        else updated.add(eventId);
        return updated;
      });
    } catch (error) {
      console.error("Errore durante il salvataggio dell'evento", error);
    }
  };

  return (
<Container className="events-container">
  <h2>Eventi</h2>
  <Row>
    {events.map((event) => (
      <Col key={event._id} md={4} className="mb-4">
        <Card className="event-card">
          <Card.Body>
            <Card.Title className="event-card-title">{event.title}</Card.Title>
            <Card.Text className="event-card-text">{event.description}</Card.Text>
            <Card.Text className="event-card-text">
              <strong>Data:</strong> {new Date(event.date).toLocaleDateString()}
            </Card.Text>
            <Button
              className="button-primary-outline event-card-button"
              onClick={() => navigate(`/event/${event._id}`)}
            >
              Dettagli Evento
            </Button>
            <Button
  className="favorite-button"
  onClick={() => toggleFavorite(event._id)}
>
  {savedEvents.has(event._id) ? (
    <FaEye color="#6E32FF" size={24} /> // 🔵 Occhio Viola se salvato
  ) : (
    <FaRegEye color="#000000" size={24} /> // ⚫ Occhio Nero se non salvato
  )}
</Button>

          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>

      {/* Modal per invitare al login */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Accedi per salvare gli eventi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Devi effettuare il login per aggiungere eventi ai preferiti.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Accedi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Events;
