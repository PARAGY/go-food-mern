import express from "express";
import { chatWithFoodAI } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public or protected based on preference - making it protected for authenticated users
router.post("/chat", protect, chatWithFoodAI);

export default router;
