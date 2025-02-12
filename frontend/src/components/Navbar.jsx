import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";

import ProfileModal from "./ProfileModal";

function MainNavbar() {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // ✅ Aggiunto per controllare il ruolo
  const navigate = useNavigate();

  useEffect(() => {
    // Controlla se l'utente è loggato e recupera il ruolo
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const user = JSON.parse(localStorage.getItem("user")); // Assicurati di salvare il ruolo nel localStorage al login
      setUserRole(user?.role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Rimuove il token dal localStorage
    localStorage.removeItem("user"); // Rimuove i dati utente
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/"); // Reindirizza alla home dopo il logout
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">WHERE THE FUCK ARE THE</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/events">EVENTS</Nav.Link>
              <Nav.Link href="/galleries">GALLERIES</Nav.Link>
              {isAuthenticated && userRole === "user" && (
                <Nav.Link href="/favorites">THINGS I LOOK FORWARD TO</Nav.Link>
              )}
              {isAuthenticated && userRole === "gallery_owner" && (
                <Nav.Link href="/manage-gallery">GESTIONE GALLERIA</Nav.Link>
              )}
              {isAuthenticated ? (
                <>
                  <Nav.Link href="/profile">PROFILE</Nav.Link>
                  <Button variant="danger" onClick={handleLogout} className="ms-2">Logout</Button>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>PROFILE</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ProfileModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
}

export default MainNavbar;
