import React, { useState, useEffect } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]); // Inizializzato come array vuoto

  useEffect(() => {
    fetch("http://localhost:3000/api/users/saved-events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assicurati che il token sia salvato correttamente
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavorites(data); // Assicurati che sia un array
        } else {
          console.error("La risposta non è un array:", data);
          setFavorites([]); // Fallback a un array vuoto
        }
      })
      .catch((error) => {
        console.error("Errore durante il recupero dei preferiti:", error);
        setFavorites([]); // Fallback a un array vuoto
      });
  }, []);

  return (
    <div className="container mt-4">
      <ul>
        {favorites.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
