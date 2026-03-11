import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const run = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://goFood:Parag7382@cluster0.zboswnp.mongodb.net/goFoodmern?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(mongoURI);
        const foods = await mongoose.connection.db.collection('fooditems').find({}).toArray();
        const res = await mongoose.connection.db.collection('restaurants').find({}).toArray();
        console.log("Foods:");
        foods.forEach(f => console.log(`${f.name} [${f.category}]`));
        console.log("\nRestaurants:");
        res.forEach(r => console.log(r.name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
