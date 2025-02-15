import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "Utente non trovato" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: "Token non valido" });
    }
  } else {
    req.user = null; // Permetti l'accesso senza autenticazione
    next();
  }
};

export default authMiddleware;