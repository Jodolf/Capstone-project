import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button } from "react-bootstrap";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("userRole"); // Recupera il ruolo dell'utente

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/events/${eventId}`);
        if (!response.ok) throw new Error("Evento non trovato");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDeleteEvent = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Errore nell'eliminazione dell'evento");

      alert("Evento eliminato con successo!");
      navigate("/events"); // Reindirizza alla lista eventi
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  return (
    <Container className="mt-4">
      {error && <p className="text-danger">{error}</p>}

      {event ? (
        <Card>
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Text><strong>Descrizione:</strong> {event.description}</Card.Text>
            <Card.Text><strong>Data:</strong> {new Date(event.date).toLocaleDateString()}</Card.Text>
            <Card.Text><strong>Posizione:</strong> {event.location}</Card.Text>
            <Card.Text><strong>Tipo:</strong> {event.type}</Card.Text>
            <Card.Text><strong>Costo:</strong> {event.cost > 0 ? `${event.cost}€` : "Gratis"}</Card.Text>

            {/* Aggiungi il link alla galleria associata */}
            {event.gallery && (
              <Card.Text>
                <strong>Galleria:</strong>{" "}
                <span
                  onClick={() => navigate(`/gallery/${event.gallery._id}`)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {event.gallery.name}
                </span>
              </Card.Text>
            )}

            {/* Mostra i pulsanti solo se l'utente è un Gallerista */}
            {userRole === "gallery_owner" && (
              <>
                <Button variant="primary" onClick={() => navigate(`/edit-event/${eventId}`)}>✏ Modifica</Button>
                <Button variant="danger" className="ms-2" onClick={handleDeleteEvent}>🗑 Elimina</Button>
              </>
            )}
          </Card.Body>
        </Card>
      ) : (
        <p>Caricamento in corso...</p>
      )}
    </Container>
  );
};

export default EventDetails;
