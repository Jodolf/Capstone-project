import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, ListGroup, Card, Row, Col } from "react-bootstrap";

import "../styles/GalleryDetail.css";

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
<Container className="gallery-detail-container">
  {gallery ? (
    <>
      <Card>
        <Card.Img
          variant="top"
          className="gallery-detail-image"
          src={gallery.images.length > 0 ? gallery.images[0] : "https://via.placeholder.com/800x300"}
          alt={gallery.name}
        />
        <Card.Body>
          <Card.Title className="gallery-detail-title">{gallery.name}</Card.Title>
          <Card.Text className="gallery-detail-text">
            <strong>Posizione:</strong> {gallery.location}
          </Card.Text>
          <Card.Text className="gallery-detail-text">{gallery.description}</Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Eventi Associati</h3>

      {events.length > 0 ? (
        <Row>
          {events.map((event) => (
            <Col key={event._id} md={4} className="mb-4">
              <Card className="event-card" onClick={() => navigate(`/event/${event._id}`)}>
                <Card.Body>
                  <Card.Title className="event-card-title">{event.title}</Card.Title>
                  <Card.Text className="event-card-text">{event.description}</Card.Text>
                  <Card.Text className="event-card-text">
                    <strong>Data:</strong> {new Date(event.date).toLocaleDateString()}
                  </Card.Text>
                  <button className="button-primary-outline event-card-button">Dettagli Evento</button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
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
