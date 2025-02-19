import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEye, FaEye } from "react-icons/fa"; // Icone occhio
import "../styles/GalleryDetail.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate(); 

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
      {favorites.length === 0 ? (
        <p>NO EVENTS SAVED.</p>
      ) : (

        <div className="gallery-events-list">
          {favorites.map((event) => (
            <ul>
                  <li key={event._id}>
                    <Link to={`/event/${event._id}`} className="gallery-event-link" style={{ textDecoration: "none" }}>
                      <strong>{event.title}</strong> -{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </Link>
                  </li>
            </ul>
          ))}
        </div>



      )}
    </div>
  );
};

export default Favorites;
