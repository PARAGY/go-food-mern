import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import aiChatRoute from "./routes/aiChat.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ STATIC FILES FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/test", (req, res) => {
  res.send("Server Working");
});

// Routes
// app.use("/api/ai", aiChatRoute);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);