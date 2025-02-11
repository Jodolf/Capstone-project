import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Errore nel recupero del profilo:", error));
  }, []);

  if (!user) return <p>Caricamento...</p>;

  return (
    <div className="container mt-4">
      <h2>Profilo Utente</h2>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Ruolo:</strong> {user.role}</p>
    </div>
  );
};

export default UserProfile;