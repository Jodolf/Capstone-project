import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProfileModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Accedi o Registrati</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Effettua il login per accedere al tuo profilo oppure registrati se non hai un account.</p>
        <div className="d-flex justify-content-around">
          <Link to="/login">
            <Button variant="primary">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="success">Registrati</Button>
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProfileModal;