import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Registra un nuovo utente
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Controlla se l'email è già registrata
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già registrata' });
    }

    // Crittografa la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea il nuovo utente
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Ruolo predefinito: 'user'
    });
    await user.save();

    res.status(201).json({ message: 'Utente registrato con successo', user });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la registrazione', error });
  }
};

// Effettua il login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trova l'utente tramite email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Confronta la password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password non corretta' });
    }

    // Genera il token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Includiamo il ruolo nel token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login effettuato con successo',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il login', error });
  }
};

// Ottieni il profilo dell'utente autenticato
const getUserProfile = async (req, res) => {
  try {
    // Recupera l'utente dal token
    const user = await User.findById(req.user.id).select('-password'); // Escludi la password
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero del profilo', error });
  }
};

export {registerUser, loginUser, getUserProfile};