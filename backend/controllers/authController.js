import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "HaHa";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, location, phone } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: securePassword,
      location,
      phone
    });

    const data = { user: { id: user.id, role: user.role } };
    const authToken = jwt.sign(data, jwtSecret, { expiresIn: '7d' });

    res.status(201).json({ success: true, authToken });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const data = { user: { id: user.id, role: user.role } };
    const authToken = jwt.sign(data, jwtSecret, { expiresIn: '7d' });

    res.status(200).json({ success: true, authToken });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("addresses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

import axios from "axios";

export const getLocation = async (req, res) => {
  try {
    const { lat, long } = req.body.latlong;
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`
    );
    let place = response.data.results[0].components;
    let { village, county, state_district, state, postcode } = place;
    // Formatting handles undefined cases gracefully
    const components = [village, county, state_district, state, postcode].filter(Boolean);
    const location = components.join(", ");
    
    res.status(200).json({ location });
  } catch (error) {
    console.error("Get Location Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
