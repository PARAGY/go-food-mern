import mongoose from "mongoose";
import Restaurant from "./models/Restaurant.js";
import FoodItem from "./models/FoodItem.js";
import { fetchFoodImage } from "./utils/imageFetcher.js";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://goFood:Parag7382@cluster0.zboswnp.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0";

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Restaurant.deleteMany({});
    await FoodItem.deleteMany({});
    console.log("Cleared old data.");

    const restaurantNames = [
      { name: "The Burger House", cuisine: "American, Fast Food", type: "burger" },
      { name: "Spice Route Biryani", cuisine: "North Indian, Mughal", type: "biryani" },
      { name: "Pizzeria Deluxe", cuisine: "Italian, Pizza", type: "pizza" },
      { name: "Dosa Junction", cuisine: "South Indian", type: "dosa" },
      { name: "Wok & Noodles", cuisine: "Chinese, Asian", type: "noodles" }
    ];

    for (const resData of restaurantNames) {
      const restaurant = await Restaurant.create({
        name: resData.name,
        description: `Experience the best ${resData.cuisine} in town.`,
        cuisineType: resData.cuisine.split(", "),
        rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
        deliveryTime: `${Math.floor(Math.random() * (45 - 20) + 20)} mins`,
        logo: await fetchFoodImage(`${resData.type} logo icon`),
        images: [await fetchFoodImage(`${resData.type} restaurant interior`) ]
      });

      console.log(`Created Restaurant: ${restaurant.name}`);

      const foods = [
        { name: `Classic ${resData.type}`, price: 199, category: resData.cuisine.split(",")[0] },
        { name: `Premium ${resData.type}`, price: 299, category: resData.cuisine.split(",")[0] },
        { name: `Loaded ${resData.type} Platter`, price: 449, category: resData.cuisine.split(",")[0] }
      ];

      for (const food of foods) {
        await FoodItem.create({
          restaurant: restaurant._id,
          name: food.name,
          description: `Deliciously prepared ${food.name} with fresh ingredients.`,
          price: food.price,
          category: food.category,
          image: await fetchFoodImage(food.name),
          nutrition: {
            calories: `${Math.floor(Math.random() * 500 + 200)} kcal`,
            protein: `${Math.floor(Math.random() * 20 + 10)}g`,
            carbs: `${Math.floor(Math.random() * 50 + 20)}g`,
            fat: `${Math.floor(Math.random() * 15 + 5)}g`
          }
        });
      }
    }

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
