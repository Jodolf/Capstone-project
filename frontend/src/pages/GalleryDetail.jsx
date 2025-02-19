import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import "../styles/GalleryDetail.css";

const GalleryDetail = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/galleries/${galleryId}`
        );
        if (!response.ok) throw new Error("Galleria non trovata");
        const data = await response.json();
        setGallery(data);
      } catch (error) {
        console.error("Errore nel recupero della galleria:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/events/gallery/${galleryId}`
        );
        if (!response.ok) throw new Error("Eventi non trovati");
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
    <div className="gallery-detail-container">
      {gallery ? (
        <>
          <div className="gallery-detail-card">
            
            {/*  Sezione Immagine */}
            <div className="gallery-detail-image-container">
              {gallery.images?.length > 0 ? (
                <img
                  src={`http://localhost:3001${
                    gallery.images[gallery.images.length - 1]
                  }`}
                  alt={gallery.name}
                  className="gallery-detail-image"
                />
              ) : (
                <div className="gallery-placeholder"></div>
              )}
            </div>

            {/*  Sezione Dettagli + Lista Eventi */}
            <div className="gallery-detail-content">
              <h1 className="gallery-detail-title">{gallery.name}</h1>
              <p className="gallery-detail-description">
                {gallery.description}
              </p>
              <p className="gallery-detail-text">
                <strong>POSIZIONE:</strong> {gallery.location}
              </p>

              {/*  Lista degli Eventi - Ora dentro la descrizione */}
              <div className="gallery-events-list">
                {/*<h3>Eventi Associati</h3>*/}
                {events.length > 0 ? (
                  <ul>
                    {events.map((event) => (
                      <li key={event._id}>
                        <span
                          className="gallery-event-link"
                          onClick={() => navigate(`/event/${event._id}`)}
                        >
                          {event.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>NO EVENT FOUND.</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Caricamento...</p>
      )}
    </div>
  );
};

export default GalleryDetail;
