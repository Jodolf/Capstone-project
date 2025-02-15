import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const CreateEvent = ({ onEventCreated, galleries }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description, gallery, date, location }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Errore nella creazione dell'evento");

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      onEventCreated(data);
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error);
    }
  };

  return (
    <>
      {showAlert && <Alert variant="success">Evento creato con successo!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Titolo Evento</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>
        <Button type="submit">Crea</Button>
      </Form>
    </>
  );
};

export default CreateEvent;
