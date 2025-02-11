import React, { useState, useEffect } from "react";

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/galleries")
      .then((response) => response.json())
      .then((data) => setGalleries(data))
      .catch((error) => console.error("Errore:", error));
  }, []);

  return (
    <div className="container mt-4">
      <ul>
        {galleries.map((gallery) => (
          <li key={gallery._id}>
            <h3>{gallery.name}</h3>
            <p>{gallery.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Galleries;
