import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const MainNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    console.log("🔍 Ruolo utente in Navbar:", role); // Debug
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
    <Navbar expand="lg" className="bg-body-tertiary px-4">
      <Container fluid>
        {/* 🔹 Sezione Sinistra */}
        <Nav className="me-auto">
          <Navbar.Brand as={Link} to="/">
            WHERE THE ART IS
          </Navbar.Brand>
          <Nav.Link as={Link} to="/events">
            EVENTS
          </Nav.Link>
          <Nav.Link as={Link} to="/galleries">
            GALLERIES
          </Nav.Link>
        </Nav>

        {/* 🔹 Sezione Destra */}
        <Nav className="ms-auto align-items-center">
          {isAuthenticated ? (
            <>

<Nav.Link as={Link} to="/profile">
  👤 Profilo
</Nav.Link>

              {userRole === "user" && (
                <Nav.Link as={Link} to="/favorites">
                  ⭐ Preferiti
                </Nav.Link>
              )}

              {userRole === "gallery_owner" && (
                <Nav.Link as={Link} to="/manage-galleries">
                  🏛️ Gestione Gallerie
                </Nav.Link>
              )}

              <Button
                className="button-primary-outline ms-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                className="button-primary me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="button-primary-outline"
                onClick={() => navigate("/register")}
              >
                Registrati
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
