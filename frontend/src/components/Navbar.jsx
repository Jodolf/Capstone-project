import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const MainNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole"); // Recupera il ruolo salvato
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">WHERE THE ART IS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/events">EVENTS</Nav.Link>
            <Nav.Link href="/galleries">GALLERIES</Nav.Link>
          </Nav>

          {/* Menu Utente */}
          {isAuthenticated ? (
            <Nav>
              <NavDropdown title="👤 Account" id="user-menu">
                <NavDropdown.Item href="/profile">Gestione Profilo</NavDropdown.Item>

                {userRole === "user" && (
                  <NavDropdown.Item href="/favorites">Lista Preferiti</NavDropdown.Item>
                )}

                {userRole === "gallery_owner" && (
                  <>
  <NavDropdown.Item as={Link} to="/manage-galleries">Gestione Gallerie</NavDropdown.Item>
  {/*<NavDropdown.Item href="/manage-events">Gestione Eventi</NavDropdown.Item>*/}
                  </>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <>
            <Button variant="primary" onClick={() => navigate("/login")}>Login</Button>
            <Button variant="secondary" className="ms-2" onClick={() => navigate("/register")}>Registrati</Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;