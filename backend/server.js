import express from ('express');
import dotenv from ('dotenv');
import cors from ('cors');
import connectDB from ('./config/db');
import mongoose from "mongoose";

// Caricare le variabili di ambiente
dotenv.config();

// Connettere a MongoDB
connectDB();

// Inizializzare Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Per leggere JSON nel body delle richieste

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Rotta base per test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Avviare il server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
