import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // ✅ Aggiunto Navigate

import MainNavbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Galleries from "./pages/Galleries";
import Favorites from "./pages/Favorites.js";

import UserProfile from "./pages/UserProfile";
import GalleryOwnerProfile from "./pages/GalleryOwnerProfile";

import ManageGallery from "./pages/ManageGallery"; // ✅ Importata la gestione galleria
import EditEvent from "./components/EditEvent"; // Importa il componente di modifica evento

import EventDetails from "./pages/EventDetail";
import GalleryDetail from "./pages/GalleryDetail";

import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Controlla se l'utente è loggato
  return token ? children : <Navigate to="/login" />; //  Navigate ora è importato correttamente
};

function App() {
  return (
    <Router>
      <div className="App">
        <MainNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/galleries" element={<Galleries />} />
          <Route path="/favorites" element={<Favorites />} />

          <Route path="/manage-galleries" element={<GalleryOwnerProfile />} />
          <Route path="/manage-gallery/:id" element={<ManageGallery />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />

          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route path="/gallery/:galleryId" element={<GalleryDetail />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                {localStorage.getItem("user") &&
                JSON.parse(localStorage.getItem("user")).role ===
                  "gallery_owner" ? (
                  <GalleryOwnerProfile />
                ) : (
                  <UserProfile />
                )}
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
