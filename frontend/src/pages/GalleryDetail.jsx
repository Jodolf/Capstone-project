import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";

const GalleryDetail = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/galleries/${galleryId}`);
        const data = await response.json();
        setGallery(data);
      } catch (error) {
        console.error("Errore nel recupero della galleria:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/events/gallery/${galleryId}`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Errore nel recupero degli eventi:", error);
      }
    };

    fetchGallery();
    fetchEvents();
  }, [galleryId]);

  return (
    <Container className="mt-4">
      {gallery ? (
        <>
          <h2>{gallery.name}</h2>
          <p><strong>Posizione:</strong> {gallery.location}</p>
          <p>{gallery.description}</p>
          <h3>Eventi Associati</h3>
          {events.length > 0 ? (
            <ListGroup>
              {events.map((event) => (
                <ListGroup.Item key={event._id} onClick={() => navigate(`/event/${event._id}`)} style={{ cursor: "pointer", color: "blue" }}>
                  <strong>{event.title}</strong> - {new Date(event.date).toLocaleDateString()}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Nessun evento disponibile.</p>
          )}
        </>
      ) : (
        <p>Caricamento...</p>
      )}
    </Container>
  );
};

export default GalleryDetail;
