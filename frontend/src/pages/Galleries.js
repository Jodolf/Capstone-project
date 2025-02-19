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
    <div className="galleries-container">
      {galleries.map((gallery) => (
        <div
          key={gallery._id}
          className="gallery-card"
          onClick={() => navigate(`/gallery/${gallery._id}`)}
        >
          {gallery.images?.length > 0 ? (
            <img src={gallery.images[0]} alt={gallery.name} />
          ) : (
            <div className="gallery-placeholder"></div> // 🔥 Placeholder bianco
          )}
          <div className="gallery-info">
            <h3 className="gallery-title">{gallery.name}</h3>
            <p className="gallery-location">{gallery.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
  };

export default Galleries;
