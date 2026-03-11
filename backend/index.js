import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create HTTP server and initialize Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allows frontend connections
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Socket configuration map
global.io = io; // Make io globally accessible for order controller

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Middleware
app.use(cors());
app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

// Construct __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load static images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// API Routes
app.use("/api/users", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/ai", aiRoutes);
// Nesting food routes under restaurant
app.use("/api/restaurants/:restaurantId/foods", foodRoutes);

app.get("/", (req, res) => {
  res.send({ message: "GoFood Zomato Clone API Running" });
});

// Custom Error Handling Middleware
app.use(errorHandler);

// Start Server with Socket.io
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
