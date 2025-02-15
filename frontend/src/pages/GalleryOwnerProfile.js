import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, ListGroup } from "react-bootstrap";
import CreateGallery from "../components/CreateGallery";

const GalleryOwnerProfile = () => {
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/galleries/owned", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Errore nel recupero delle gallerie");
        setGalleries(data);
      } catch (error) {
        console.error("Errore nel recupero delle gallerie:", error);
      }
    };

    fetchGalleries();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Le tue Gallerie</h2>
      <ListGroup>
        {galleries.map((gallery) => (
          <ListGroup.Item key={gallery._id} onClick={() => navigate(`/manage-gallery/${gallery._id}`)}>
            <h4>{gallery.name}</h4>
            <p>{gallery.location}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* ✅ Form separato per la creazione di nuove gallerie */}
      <CreateGallery onGalleryCreated={(newGallery) => setGalleries([...galleries, newGallery])} />
    </Container>
  );
};

export default GalleryOwnerProfile;
