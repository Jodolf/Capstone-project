import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button } from "react-bootstrap";
import { FaRegEye, FaEye } from "react-icons/fa";

import "../styles/EventDetail.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem("userRole"); // Recupera il ruolo dell'utente
  const [savedEvents, setSavedEvents] = useState(new Set());

  const user = JSON.parse(localStorage.getItem("user")) || {};
  console.log("👤 Dati utente recuperati:", user);
  console.log("🆔 ID utente loggato:", user.id || "Nessun utente loggato");

  const eventOwnerId = event?.owner?._id?.toString() || "";
  const userId = user?.id?.toString() || "";
  const isOwner = eventOwnerId === userId;

  console.log("📌 Evento recuperato:", event);
  console.log("🔍 Evento Owner (dal backend):", event?.owner);
  console.log("🔑 Utente Loggato (dal localStorage):", user);
  console.log(
    "🛠 Confronto diretto:",
    event?.owner?._id?.toString(),
    "===",
    user?.id?.toString()
  );
  console.log(
    "✅ isOwner:",
    event?.owner?._id?.toString() === user?.id?.toString()
  );

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setSavedEvents(new Set(storedFavorites));
  }, []);

  const toggleFavorite = (eventId) => {
    const updatedFavorites = new Set(savedEvents);

    if (updatedFavorites.has(eventId)) {
      updatedFavorites.delete(eventId);
    } else {
      updatedFavorites.add(eventId);
    }

    setSavedEvents(updatedFavorites);
    localStorage.setItem(
      "favorites",
      JSON.stringify(Array.from(updatedFavorites))
    );
  };

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

  const handleDeleteEvent = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Errore nell'eliminazione dell'evento");

      alert("Evento eliminato con successo!");
      navigate("/events"); // Reindirizza alla lista eventi
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  return (
    <Container className="event-detail-container">
      {error && <p className="text-danger">{error}</p>}

      {event ? (
        <Card className="event-card">
          <Card.Body>
            <Card.Title className="event-detail-title">
              {event.title}
            </Card.Title>
            <Card.Text className="event-detail-text">
              <strong>Descrizione:</strong> {event.description}
            </Card.Text>
            <Card.Text className="event-detail-text">
              <strong>Data:</strong> {new Date(event.date).toLocaleDateString()}
            </Card.Text>
            <Card.Text className="event-detail-text">
              <strong>Posizione:</strong> {event.location}
            </Card.Text>
            <Card.Text className="event-detail-text">
              <strong>Tipo:</strong> {event.type}
            </Card.Text>
            <Card.Text className="event-detail-text">
              <strong>Costo:</strong>{" "}
              {event.cost > 0 ? `${event.cost}€` : "Gratis"}
            </Card.Text>
            {user && user.role === "user" && event && (
  <Button className="favorite-button" onClick={() => toggleFavorite(event._id)}>
    {savedEvents.has(event._id) ? (
      <FaEye color="#6E32FF" size={24} /> // 🟣 Occhio Viola se salvato
    ) : (
      <FaRegEye color="#000000" size={24} /> // ⚫ Occhio Nero se non salvato
    )}
  </Button>
)}

            {event.gallery && (
              <Card.Text>
                <strong>Galleria:</strong>{" "}
                <span
                  onClick={() => navigate(`/gallery/${event.gallery._id}`)}
                  className="event-detail-link"
                >
                  {event.gallery.name}
                </span>
              </Card.Text>
            )}

            {user.role === "gallery_owner" && isOwner && (
              <div className="event-detail-buttons">
                <Button
                  className="button-primary"
                  onClick={() => navigate(`/edit-event/${eventId}`)}
                >
                  ✏ Modifica
                </Button>
                <Button
                  className="button-primary-outline"
                  onClick={handleDeleteEvent}
                >
                  🗑 Elimina
                </Button>
              </div>
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
