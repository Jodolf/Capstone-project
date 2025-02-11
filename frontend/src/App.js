import "./App.css";
import React from "react";

import MainNavbar from "./components/Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Galleries from "./pages/Galleries";
import Favorites from "./pages/Favorites.js";
import UserProfile from "./pages/UserProfile";
import GalleryOwnerProfile from "./pages/GalleryOwnerProfile";

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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/gallery-owner" element={<GalleryOwnerProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
