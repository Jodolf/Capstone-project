import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

import "../styles/EditEvent.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registrazione fallita");
  
      setSuccessMessage("Registrazione completata! Ora puoi accedere.");
      setTimeout(() => navigate("/login"), 2000); 
    } catch (error) {
      setError(error.message);
    }
  };
    return (
    <div className="edit-event-container">
      <h2>SIGN UP</h2>
      {error && <p className="text-danger">{error}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>NAME</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>EMAIL</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>PASSWORD</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>ROLE</label>
          <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">USER</option>
            <option value="gallery_owner">GALLERY OWNER</option>
          </select>
        </div>

        <div className="edit-event-buttons">
            <Button type="submit" className="button-primary">
              SAVE
            </Button>
          </div>
      </form>
    </div>
  );
};

export default Register;