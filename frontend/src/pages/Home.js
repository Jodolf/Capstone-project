import React, { useState, useEffect } from "react";
import MapboxMap from "../components/MapboxMap";

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/events") // Recupera gli eventi
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Errore nel recupero degli eventi:", error));
  }, []);

  return (
    <div>
      <MapboxMap events={events} /> {/* Ora passa gli eventi */}
    </div>
  );
};

export default Home;