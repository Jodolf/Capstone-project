import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const CreateGallery = ({ onGalleryCreated }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
  
      console.log("📤 Dati inviati al backend:", {
        name,
        location,
        description,
        latitude,
        longitude,
      });
  
      const response = await fetch("http://localhost:3001/api/galleries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location, description, latitude, longitude }), 
      });
  
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || "Errore nella creazione della galleria"
        );
  
      console.log("✅ Galleria creata con successo:", data);
  
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      onGalleryCreated(data); 
    } catch (error) {
      console.error("❌ Errore nella creazione della galleria:", error);
    }
  };
  
  return (
    <>
      {showAlert && (
        <Alert variant="success">Galleria creata con successo!</Alert>
      )}
      <h2>CREATE A NEW GALLERY</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>NAME</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>POSITION</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>LATITUDE</Form.Label>
          <Form.Control
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value ? parseFloat(e.target.value) : "")
            } 
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>LONGITUDE</Form.Label>
          <Form.Control
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value ? parseFloat(e.target.value) : "")
            } 
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>DESCRIPTION</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <div className="edit-event-buttons">
          <Button type="submit" className="button-primary">
            CREATE
          </Button>
        </div>
      </Form>
    </>
  );
};

export default CreateGallery;
