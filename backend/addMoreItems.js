import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant.js";
import FoodItem from "./models/FoodItem.js";

dotenv.config();

const run = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://goFood:Parag7382@cluster0.zboswnp.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(mongoURI);
        console.log("Connected to DB");

        // 1. Add new Restaurant: Punjabi Dhaba
        const existingRes = await Restaurant.findOne({ name: "Punjabi Dhaba" });
        let restaurant;
        if (!existingRes) {
            restaurant = await Restaurant.create({
                name: "Punjabi Dhaba",
                description: "Authentic North Indian Thalis, Roti, and Sabji",
                cuisineType: ["North Indian", "Thali"],
                deliveryTime: "35-45 mins",
                rating: 4.5,
                address: "National Highway, Punjab",
                images: [],
                logo: ""
            });
            console.log("Added Punjabi Dhaba");
        } else {
            restaurant = existingRes;
            console.log("Punjabi Dhaba already exists");
        }

        // 2. Add new Food Items
        const newItems = [
            {
                name: "Tandoori Roti",
                description: "Freshly baked whole wheat bread in a clay oven",
                price: 15,
                category: "Khana",
                isVeg: true,
                restaurant: restaurant._id,
                options: [{ size: "Regular", price: 15 }]
            },
            {
                name: "Paneer Sabji",
                description: "Delicious Paneer curry with rich Indian spices",
                price: 180,
                category: "Khana",
                isVeg: true,
                restaurant: restaurant._id,
                options: [{ size: "Half", price: 100 }, { size: "Full", price: 180 }]
            },
            {
                name: "Mix Veg Sabji",
                description: "Seasonal vegetables cooked with authentic masala",
                price: 150,
                category: "Khana",
                isVeg: true,
                restaurant: restaurant._id,
                options: [{ size: "Half", price: 80 }, { size: "Full", price: 150 }]
            },
            {
                name: "Special Punjabi Thali",
                description: "Complete meal with Roti, Sabji, Dal, Rice, and Sweet",
                price: 250,
                category: "Khana",
                isVeg: true,
                restaurant: restaurant._id,
                options: [{ size: "Standard", price: 250 }]
            }
        ];

        for (const item of newItems) {
            const existingItem = await FoodItem.findOne({ name: item.name });
            if (!existingItem) {
                await FoodItem.create(item);
                console.log(`Added ${item.name}`);
            } else {
                console.log(`${item.name} already exists`);
            }
        }

        console.log("Done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
