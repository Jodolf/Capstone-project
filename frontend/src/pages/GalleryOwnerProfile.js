import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import CreateGallery from "../components/CreateGallery";
import "../styles/GalleryOwnerProfile.css";

const GalleryOwnerProfile = () => {
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ Nessun token trovato, impossibile recuperare le gallerie");
          return;
        }

        const response = await fetch("http://localhost:3001/api/galleries/owned", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        setGalleries(data);
      } catch (error) {
        console.error("❌ Errore nel recupero delle gallerie:", error);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <Container className="edit-event-container">
      <h2>YOUR GALLERIES</h2>

      {galleries.length > 0 ? (
        <div className="gallery-grid">
          {galleries.map((gallery) => (
            <div
              key={gallery._id}
              className="gallery-card-owner"
              onClick={() => navigate(`/manage-gallery/${gallery._id}`)}
            >
              <h4 className="gallery-name">{gallery.name}</h4>
              <p className="gallery-location">{gallery.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-gallery-text">NO GALLERY FOUND.</p>
      )}
      
      <CreateGallery onGalleryCreated={(newGallery) => setGalleries([...galleries, newGallery])} />
    </Container>
  );
};

export default GalleryOwnerProfile;
