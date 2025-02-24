import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; 

import MainNavbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Galleries from "./pages/Galleries";
import Favorites from "./pages/Favorites.js";

import UserProfile from "./pages/UserProfile";
import OwnerProfile from "./pages/OwnerProfile";
import GalleryOwnerProfile from "./pages/GalleryOwnerProfile";

import ManageGallery from "./pages/ManageGallery"; 
import EditEvent from "./components/EditEvent"; 

import EventDetails from "./pages/EventDetail";
import GalleryDetail from "./pages/GalleryDetail";

import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />; 
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
    localStorage.getItem("token") ? (
      JSON.parse(localStorage.getItem("user")).role === "gallery_owner" ? (
        <OwnerProfile />
      ) : (
        <UserProfile />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
