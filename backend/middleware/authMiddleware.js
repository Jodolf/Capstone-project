import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Accesso negato. Token non fornito.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role, // Aggiungiamo il ruolo decodificato
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token non valido.' });
  }
};

export default authMiddleware;
