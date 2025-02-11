import React, { useEffect, useState } from "react";

const GalleryOwnerProfile = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        if (data.role === "gallery_owner") {
          fetch(`http://localhost:3001/api/galleries/${data.id}`)
            .then((res) => res.json())
            .then((galleryData) => setGallery(galleryData));

          fetch(`http://localhost:3001/api/events?ownerId=${data.id}`)
            .then((res) => res.json())
            .then((eventData) => setEvents(eventData));
        }
      })
      .catch((error) => console.error("Errore nel recupero del profilo:", error));
  }, []);

  if (!user) return <p>Caricamento...</p>;

  return (
    <div className="container mt-4">
      <h2>Profilo Gallerista</h2>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {gallery && (
        <div>
          <h3>La tua Galleria</h3>
          <p><strong>Nome:</strong> {gallery.name}</p>
          <p><strong>Location:</strong> {gallery.location}</p>
        </div>
      )}

      {events.length > 0 && (
        <div>
          <h3>I tuoi Eventi</h3>
          <ul>
            {events.map((event) => (
              <li key={event._id}>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GalleryOwnerProfile;