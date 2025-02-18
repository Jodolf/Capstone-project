import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

import "../styles/Galleries.css";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate(); // Per la navigazione

  useEffect(() => {
    fetch("http://localhost:3001/api/galleries")
      .then((response) => response.json())
      .then((data) => {
        console.log("📥 Dati ricevuti dal backend:", data);
        if (Array.isArray(data)) {
          setGalleries(data);
        } else {
          console.error("❌ Errore: la risposta non è un array", data);
          setGalleries([]);
        }
      })
      .catch((error) => {
        console.error("❌ Errore nel recupero delle gallerie:", error);
        setGalleries([]);
      });
  }, []);

  return (
<Container className="galleries-container">
  <h2>Gallerie d'Arte</h2>
  <Row>
    {galleries.length > 0 ? (
      galleries.map((gallery) => (
        <Col key={gallery._id} md={4} className="mb-4">
          <Card className="gallery-card" onClick={() => navigate(`/gallery/${gallery._id}`)}>
            <Card.Img
              variant="top"
              src={gallery.images.length > 0 ? gallery.images[0] : "https://via.placeholder.com/300x200"}
              alt={gallery.name}
            />
            <Card.Body>
              <Card.Title className="gallery-card-title">{gallery.name}</Card.Title>
              <Card.Text className="gallery-card-text">{gallery.location}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))
    ) : (
      <p>❌ Nessuna galleria trovata.</p>
    )}
  </Row>
</Container>
  );
};

export default Galleries;
