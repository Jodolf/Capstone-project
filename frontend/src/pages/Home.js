import React, { useState, useEffect } from "react";
import MapboxMap from "../components/MapboxMap";
import "../styles/Home.css"; 

const Home = () => {
  const [events, setEvents] = useState([]);
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Errore nel recupero degli eventi:", error));

    fetch("http://localhost:3001/api/galleries")
      .then((res) => res.json())
      .then((data) => setGalleries(data))
      .catch((error) => console.error("Errore nel recupero delle gallerie:", error));
  }, []);

  return (
    <div>
      <MapboxMap events={events} galleries={galleries}/> 
    </div>
  );
};

export default Home;