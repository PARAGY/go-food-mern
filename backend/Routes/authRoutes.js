import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile, getLocation } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("name").isLength({ min: 3 }),
], registerUser);

router.post("/login", [
  body("email").isEmail(),
  body("password").exists()
], loginUser);

router.post("/getlocation", getLocation);

router.get("/profile", protect, getUserProfile);

export default router;
