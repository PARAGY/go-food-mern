import mongoose from "mongoose";
import dotenv from "dotenv";
import FoodItem from "./models/FoodItem.js";

dotenv.config();

const nutritionMapping = {
    "Classic burger": { calories: "350 kcal", protein: "18g", carbs: "30g", fat: "15g", fiber: "2g", vitamins: "Vit B12, Iron" },
    "Premium burger": { calories: "450 kcal", protein: "25g", carbs: "35g", fat: "22g", fiber: "3g", vitamins: "Vit B12, Zinc" },
    "Loaded burger Platter": { calories: "850 kcal", protein: "40g", carbs: "70g", fat: "45g", fiber: "5g", vitamins: "Complex" },
    "Classic biryani": { calories: "480 kcal", protein: "15g", carbs: "65g", fat: "18g", fiber: "4g", vitamins: "Vit A, B6" },
    "Premium biryani": { calories: "550 kcal", protein: "22g", carbs: "70g", fat: "20g", fiber: "4g", vitamins: "Vit A, B12" },
    "Loaded biryani Platter": { calories: "950 kcal", protein: "35g", carbs: "110g", fat: "35g", fiber: "6g", vitamins: "Multivitamin" },
    "Classic pizza": { calories: "280 kcal", protein: "12g", carbs: "35g", fat: "10g", fiber: "1g", vitamins: "Calcium" },
    "Premium pizza": { calories: "450 kcal", protein: "22g", carbs: "40g", fat: "25g", fiber: "2g", vitamins: "Calcium, Vit D" },
    "Loaded pizza Platter": { calories: "1200 kcal", protein: "50g", carbs: "120g", fat: "60g", fiber: "4g", vitamins: "Rich" },
    "Classic dosa": { calories: "150 kcal", protein: "4g", carbs: "25g", fat: "4g", fiber: "2g", vitamins: "B Vitamins" },
    "Premium dosa": { calories: "250 kcal", protein: "8g", carbs: "35g", fat: "10g", fiber: "3g", vitamins: "Iron, B Vitamins" },
    "Loaded dosa Platter": { calories: "600 kcal", protein: "15g", carbs: "80g", fat: "25g", fiber: "5g", vitamins: "Healthy Mix" },
    "Classic noodles": { calories: "330 kcal", protein: "10g", carbs: "45g", fat: "12g", fiber: "2g", vitamins: "Iron" },
    "Premium noodles": { calories: "450 kcal", protein: "15g", carbs: "55g", fat: "18g", fiber: "3g", vitamins: "Iron, Zinc" },
    "Loaded noodles Platter": { calories: "800 kcal", protein: "25g", carbs: "90g", fat: "35g", fiber: "4g", vitamins: "A, E" },
    "Tandoori Roti": { calories: "80 kcal", protein: "3g", carbs: "15g", fat: "1g", fiber: "2g", vitamins: "B1, B3" },
    "Paneer Sabji": { calories: "450 kcal", protein: "18g", carbs: "12g", fat: "32g", fiber: "3g", vitamins: "Calcium, Vit D" },
    "Mix Veg Sabji": { calories: "180 kcal", protein: "6g", carbs: "20g", fat: "8g", fiber: "6g", vitamins: "Vit A, C, K" },
    "Special Punjabi Thali": { calories: "850 kcal", protein: "30g", carbs: "90g", fat: "40g", fiber: "8g", vitamins: "Full Spectrum" }
};

const seedNutrition = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://goFood:Parag7382@cluster0.zboswnp.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(mongoURI);
        console.log("Connected to DB for Nutrition Seeding");

        const foods = await FoodItem.find({});
        for (const food of foods) {
            if (nutritionMapping[food.name]) {
                food.nutrition = nutritionMapping[food.name];
                await food.save();
                console.log(`Updated nutrition for ${food.name}`);
            }
        }
        console.log("Nutrition seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedNutrition();
