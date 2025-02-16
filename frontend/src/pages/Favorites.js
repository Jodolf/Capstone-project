import React, { useState, useEffect } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/users/saved-events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.error("La risposta non è un array:", data);
          setFavorites([]);
        }
      })
      .catch((error) => {
        console.error("Errore durante il recupero dei preferiti:", error);
        setFavorites([]);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>I miei eventi preferiti</h2>
      {favorites.length === 0 ? (
        <p>Non hai ancora salvato eventi.</p>
      ) : (
        <ul>
          {favorites.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
