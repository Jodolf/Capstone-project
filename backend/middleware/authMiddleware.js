import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      console.log("🔑 Utente autenticato:", req.user);

      next();
    } catch (error) {
      console.error("❌ Errore nell'autenticazione:", error);
      res.status(401).json({ error: "Non autorizzato, token non valido" });
    }
  } else {
    res.status(401).json({ error: "Non autorizzato, nessun token" });
  }
  console.log("🔑 Token ricevuto:", req.headers.authorization);
console.log("🔍 Utente autenticato:", req.user);

};

export default authMiddleware;
