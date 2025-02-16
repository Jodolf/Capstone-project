import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import ProfileModal from "./ProfileModal";

function MainNavbar() {
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Funzione per aggiornare lo stato dell'utente
  const updateAuthState = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const user = JSON.parse(localStorage.getItem("user"));
      setUserRole(user?.role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  // Aggiorniamo lo stato all'avvio dell'app e dopo ogni login/logout
  useEffect(() => {
    updateAuthState();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
    window.location.reload(); // 🔄 Ricarica la pagina per resettare lo stato
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">WHERE ARE THE</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/events">EVENTS</Nav.Link>
              <Nav.Link href="/galleries">GALLERIES</Nav.Link>
              
              {isAuthenticated && userRole === "user" && (
                <Nav.Link href="/favorites">THINGS I LOOK FORWARD TO</Nav.Link>
              )}

              {/*{isAuthenticated && userRole === "gallery_owner" && (
                <Nav.Link href="/manage-gallery">MANAGE</Nav.Link>
              )}*/}

              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={handleProfileClick}>PROFILE</Nav.Link>
                  <Button variant="danger" onClick={handleLogout} className="ms-2">
                    Logout
                  </Button>
                </>
              ) : (
                <Nav.Link onClick={handleProfileClick}>PROFILE</Nav.Link>
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
