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
  const userRole = localStorage.getItem("userRole");
  const [savedEvents, setSavedEvents] = useState(new Set());
  const [imageUrl, setImageUrl] = useState("");

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
      navigate("/events");
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  return (
    <div className="event-detail-container">
      {error && <p className="text-danger">{error}</p>}

      {event ? (
        <div className="event-detail-card">
          
          {/*  Sezione Immagine + Occhio */}
          <div className="event-detail-image-container">
            {event.images?.length > 0 ? (
              <img
                src={`http://localhost:3001${
                  event.images[event.images.length - 1]
                }`} // 🔥 Ultima immagine caricata
                alt="Immagine evento"
                className="event-detail-image"
              />
            ) : (
              <div className="event-placeholder"></div>
            )}

            {/*{user?.role === "user" && (
              <button className="favorite-button" onClick={() => toggleFavorite(event._id)}>
                {savedEvents.has(event._id) ? (
                  <FaEye color="#6E32FF" size={32} />
                ) : (
                  <FaRegEye color="#000000" size={32} />
                )}
              </button>
            )}*/}
          </div>

          {/*  Sezione Dettagli */}
          <div className="event-detail-content">
            <p className="event-detail-text">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <h1 className="event-detail-title">{event.title}</h1>
            <p className="event-detail-description">{event.description}</p>
            <p className="event-detail-text">
              <strong>KIND:</strong> {event.type}
            </p>
            <p className="event-detail-text">
              <strong>COST:</strong>{" "}
              {event.cost > 0 ? `${event.cost}€` : "Gratis"}
            </p>
            <p className="event-detail-text">
              <strong>POSITION:</strong> {event.location}
            </p>

            {event.gallery && (
              <p className="event-detail-text">
                {/*<strong>Galleria:</strong>{" "}*/}
                <span
                  className="event-detail-link"
                  onClick={() => navigate(`/gallery/${event.gallery._id}`)}
                >
                  {event.gallery.name}
                </span>
              </p>
            )}

            {user?.role === "gallery_owner" && isOwner && (
              <div className="event-detail-buttons">
                <Button
                  className="button-primary"
                  onClick={() => navigate(`/edit-event/${eventId}`)}
                >
                  UPDATE
                </Button>
                <Button
                  className="button-primary-outline"
                  onClick={handleDeleteEvent}
                >
                  DELETE
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>LOADING...</p>
      )}
    </div>
  );
};

export default EventDetails;
