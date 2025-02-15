import React, { useState, useEffect } from "react";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/galleries") // ✅ Ora è pubblico, non serve token
      .then((response) => response.json())
      .then((data) => {
        console.log("📥 Dati ricevuti dal backend:", data);
        if (Array.isArray(data)) {
          setGalleries(data);
        } else {
          console.error("❌ Errore: la risposta non è un array", data);
          setGalleries([]);
        }
      })
      .catch((error) => {
        console.error("❌ Errore nel recupero delle gallerie:", error);
        setGalleries([]);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Gallerie d'Arte</h2>
      <ul>
        {galleries.length > 0 ? (
          galleries.map((gallery) => (
            <li key={gallery._id}>
              <h3>{gallery.name}</h3>
              <p>{gallery.location}</p>
            </li>
          ))
        ) : (
          <p>❌ Nessuna galleria trovata.</p>
        )}
      </ul>
    </div>
  );
};

export default Galleries;
