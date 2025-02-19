import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import "../styles/EditEvent.css"; 

const OwnerProfile = () => {
  const [owner, setOwner] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOwner(data);
        setName(data.name);
        setEmail(data.email);
        setProfileImage(data.profileImage || "/uploads/default-avatar.png");
      })
      .catch((error) => console.error("❌ Errore nel recupero del profilo:", error));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore durante l'upload");

      setProfileImage(data.imageUrl);
    } catch (error) {
      console.error("❌ Errore durante l'upload:", error);
      setErrorMessage(error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email, profileImage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore durante l'aggiornamento del profilo");

      setSuccessMessage("Profilo aggiornato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <Container className="edit-event-container">
      <h2 className="edit-event-title">PROFILE</h2> 
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleUpdateProfile}>
        <Form.Group className="mb-3">
          <Form.Label>NAME</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>EMAIL</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* 🔥 Profilo immagine (opzionale, da sbloccare se servisse) */}
        {/* 
        <Form.Group className="mb-3">
          <Form.Label>Profile Image</Form.Label>
          <Form.Control type="file" onChange={handleImageUpload} />
          {profileImage && (
            <img
              src={`http://localhost:3001${profileImage}`}
              alt="Profilo"
              className="mt-2"
              style={{ width: "100px", borderRadius: "50%" }}
            />
          )}
        </Form.Group> 
        */}

        <div className="edit-event-buttons">
          <Button type="submit" className="button-primary">
            SAVE
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default OwnerProfile;