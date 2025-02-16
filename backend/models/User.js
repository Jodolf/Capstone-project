import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "gallery_owner", "admin"], // Possibili ruoli
    default: "user", // Ruolo predefinito
  },
  images: [String],
  profileImage: { type: String, default: "/uploads/default-avatar.png" }, // Immagine di default
  savedEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event", // Collegamento al modello Event
    },
  ],
  ownedGalleries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gallery" }]
});

const User = mongoose.model("User", userSchema);
export default User;
