import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import connectDB from './config/db.js';

import galleryRoutes from './routes/galleryRoute.js';
import userRoutes from './routes/userRoute.js';
import eventRoutes from './routes/eventRoute.js';

import uploadRoutes from "./routes/uploadRoute.js";

// Caricare le variabili di ambiente
dotenv.config();

// Connettere a MongoDB
connectDB();

// Inizializzare Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Per leggere JSON nel body delle richieste
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Rotta base per test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Rotte principali
app.use('/api/galleries', galleryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use("/api/upload", uploadRoutes); // 🟢 Assicura che questa linea sia presente


// Avviare il server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;