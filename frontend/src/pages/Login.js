import React, { useState, useEffect } from "react"; // ✅ Aggiunto useEffect
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

import "../styles/EditEvent.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login fallito");
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Ora salva l'intero oggetto utente
      localStorage.setItem("userRole", data.user.role);
            
      navigate("/");
      window.location.reload(); 
    } catch (error) {
      setError(error.message);
    }
};

  return (
    <div className="edit-event-container">
      <h2>LOGIN</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>EMAIL</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>PASSWORD</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

export default Login;
