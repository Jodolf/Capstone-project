import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, ListGroup, Modal, Alert } from "react-bootstrap";

const GalleryOwnerProfile = () => {
  const [showCreateGallery, setShowCreateGallery] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [galleries, setGalleries] = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/galleries", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setGalleries(data));

    fetch("http://localhost:3001/api/events", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <Container className="mt-4">
      <h2>Profilo Gallerista</h2>
      <Button variant="primary" onClick={() => setShowCreateGallery(!showCreateGallery)} className="me-2">
        {showCreateGallery ? "Nascondi Form Galleria" : "Crea Galleria"}
      </Button>
      <Button variant="secondary" onClick={() => setShowCreateEvent(!showCreateEvent)}>
        {showCreateEvent ? "Nascondi Form Evento" : "Crea Evento"}
      </Button>

      {showCreateGallery && <CreateGallery />}
      {showCreateEvent && <CreateEvent galleries={galleries || []} onEventCreated={(newEvent) => setEvents([...events, newEvent])} />}

      <h3 className="mt-4">Le tue Gallerie</h3>
      <ListGroup>
        {galleries.map((gallery) => (
          <ListGroup.Item key={gallery._id} action onClick={() => navigate(`/gallery/${gallery._id}`)}>
            {gallery.name}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h3 className="mt-4">I tuoi Eventi</h3>
      <ListGroup>
        {events.map((event) => (
          <ListGroup.Item key={event._id} action onClick={() => navigate(`/event/${event._id}`)}>
            {event.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};
const CreateGallery = ({ onGalleryCreated }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Aggiunto supporto per immagini
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false); // Stato per l'alert


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3001/api/galleries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, location, description, images }), // Aggiunto images
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Errore nella creazione della galleria");

      console.log(" Galleria creata con successo:", data);

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);


      onGalleryCreated(data);
    } catch (error) {
      console.error("Errore nella creazione della galleria:", error);
    }
  };

  return (
    <>
    {showAlert && <Alert variant="success">Galleria creata con successo!</Alert>}
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nome Galleria</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Posizione</Form.Label>
        <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Descrizione</Form.Label>
        <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Immagini (URL separati da virgole)</Form.Label>
        <Form.Control type="text" placeholder="http://image1.jpg, http://image2.jpg"
          value={images} onChange={(e) => setImages(e.target.value.split(","))} />
      </Form.Group>
      <Button type="submit">Crea</Button>
    </Form>
    </>
  );
};

const CreateEvent = ({ onEventCreated, galleries }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); 
  const [gallery, setGallery] = useState(""); 
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("exhibition"); 
  const [images, setImages] = useState([]);
  const [cost, setCost] = useState(0);
  const navigate = useNavigate();
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
        body: JSON.stringify({ title, description, gallery, date, endDate, location, type, images, cost }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Errore dal backend:", data);
        throw new Error(data.message || "Errore sconosciuto");
      }
  
      console.log("Evento creato con successo:", data);
  
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

      // Chiama `onEventCreated` solo se esiste
      if (typeof onEventCreated === "function") {
        onEventCreated(data);
      } else {
        console.warn("onEventCreated non è definito.");
      }
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error);
      alert(`Errore durante la creazione dell'evento: ${error.message}`);
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
      <Form.Group>
        <Form.Label>Descrizione</Form.Label>
        <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Galleria</Form.Label>
        <Form.Select value={gallery} onChange={(e) => setGallery(e.target.value)} required>
          <option value="">Seleziona una galleria</option>
          {galleries.map((g) => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group>
        <Form.Label>Data</Form.Label>
        <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Data Fine</Form.Label>
        <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </Form.Group>

      <Form.Group>
      <Form.Label>Posizione</Form.Label> {/* AGGIUNTO IL CAMPO LOCATION */}
      <Form.Control
        type="text"
        placeholder="Inserisci la location dell'evento"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
    </Form.Group>

      <Form.Group>
        <Form.Label>Tipo Evento</Form.Label>
        <Form.Select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="exhibition">Exhibition</option>
          <option value="performance">Performance</option>
          <option value="music">Music</option>
          <option value="workshop">Workshop</option>
        </Form.Select>
      </Form.Group>
      <Form.Group>
        <Form.Label>Immagini (URL separati da virgole)</Form.Label>
        <Form.Control type="text" placeholder="http://image1.jpg, http://image2.jpg"
          value={images} onChange={(e) => setImages(e.target.value.split(","))} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Costo</Form.Label>
        <Form.Control type="number" value={cost} onChange={(e) => setCost(e.target.value)} required />
      </Form.Group>
      <Button type="submit">Crea</Button>
    </Form>
    </>
  );
};

export default GalleryOwnerProfile;