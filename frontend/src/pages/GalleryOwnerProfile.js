import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ListGroup } from "react-bootstrap";
import CreateGallery from "../components/CreateGallery";

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
    <Container className="mt-4">
      <h2>Le tue Gallerie</h2>
      {galleries.length > 0 ? (
        <ListGroup>
          {galleries.map((gallery) => (
            <ListGroup.Item key={gallery._id} onClick={() => navigate(`/manage-gallery/${gallery._id}`)}>
              <h4>{gallery.name}</h4>
              <p>{gallery.location}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Nessuna galleria trovata.</p>
      )}
      <CreateGallery onGalleryCreated={(newGallery) => setGalleries([...galleries, newGallery])} />

    </Container>
  );
};

export default GalleryOwnerProfile;
