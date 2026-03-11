
    import express from "express";
    import User from "../models/User.js";
    import Order from "../models/Orders.js";
    import { body, validationResult } from "express-validator";
    import bcrypt from "bcryptjs";
    import jwt from "jsonwebtoken";
    import axios from "axios";
    import fetch from "../middleware/fetchdetails.js";

    const router = express.Router();
    const jwtSecret = "HaHa";

    // ✅ Create user
    router.post("/createuser", [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
    ], async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        let securePass = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email,
        location: req.body.location,
        });

        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, jwtSecret);

        success = true;
        res.json({ success, authToken });
    } catch (err) {
        console.log(err);
        res.json({ error: "Email already exists" });
    }
    });

    // ✅ Login
    router.post("/login", [
    body("email").isEmail(),
    body("password").exists()
    ], async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
        return res.status(400).json({ success, error: "Invalid credentials" });
        }

        const data = { user: { id: user.id } };
        success = true;
        const authToken = jwt.sign(data, jwtSecret);

        res.json({ success, authToken });

    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
    });

    // ✅ Get user data
    router.post("/getuser", fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
    });

    // ✅ Get location
    router.post("/getlocation", async (req, res) => {
    try {
        const { lat, long } = req.body.latlong;

        const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=74c89b3be64946ac96d777d08b878d43`
        );

        let place = response.data.results[0].components;
        let { village, county, state_district, state, postcode } = place;

        const location = `${village}, ${county}, ${state_district}, ${state}\n${postcode}`;
        res.send({ location });

    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
    });

    // ✅ Food Data (POST - used by frontend)
    router.post("/foodData", async (req, res) => {
    try {
        res.send([global.food_items, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
    });

    // ✅ ✅ Food Data (GET - browser friendly)
    router.get("/foodData", async (req, res) => {
    try {
        res.send([global.food_items, global.foodCategory]);
    } catch (error) {
        console.error(error.message);
        res.send("Server Error");
    }
    });

    // ✅ Order data
    router.post("/orderData", async (req, res) => {
    let data = req.body.order_data;
    data.unshift({ Order_date: req.body.order_date });

    try {
        let eId = await Order.findOne({ email: req.body.email });

        if (!eId) {
        await Order.create({
            email: req.body.email,
            order_data: [data]
        });
        res.json({ success: true });
        } else {
        await Order.findOneAndUpdate(
            { email: req.body.email },
            { $push: { order_data: data } }
        );
        res.json({ success: true });
        }

    } catch (error) {
        console.log(error.message);
        res.send("Server Error");
    }
    });

    // ✅ My Order Data
    router.post("/myOrderData", async (req, res) => {
    try {
        let eId = await Order.findOne({ email: req.body.email });
        res.json({ orderData: eId });
    } catch (error) {
        res.json({ error: error.message });
    }
    });

    export default router;
