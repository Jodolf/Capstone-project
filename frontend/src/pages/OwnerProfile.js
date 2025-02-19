import React, { useEffect, useState } from "react";

const OwnerProfile = () => {
  const [owner, setOwner] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOwner(data);
        setName(data.name);
        setEmail(data.email);
        setProfileImage(data.profileImage || "/uploads/default-avatar.png");
      })
      .catch((error) => console.error("❌ Errore nel recupero del profilo:", error));
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore durante l'upload");

      setProfileImage(data.imageUrl);
    } catch (error) {
      console.error("❌ Errore durante l'upload:", error);
      setErrorMessage(error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:3001/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email, profileImage }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Errore durante l'aggiornamento del profilo");

      setSuccessMessage("Profilo aggiornato con successo!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Profilo Gallerista</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleUpdateProfile}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/*<div className="mb-3">
          <label className="form-label">Immagine del profilo</label>
          <input type="file" className="form-control" onChange={handleImageUpload} />
          {profileImage && <img src={`http://localhost:3001${profileImage}`} alt="Profilo" className="mt-2" style={{ width: "100px", borderRadius: "50%" }} />}
        </div>*/}

        <button type="submit" className="btn btn-primary">Aggiorna Profilo</button>
      </form>
    </div>
  );
};

export default OwnerProfile;