import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  size: { type: String }, // e.g., "Regular", "Medium", "Large", "Half", "Full"
  price: { type: Number }
});

const FoodItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number }, // Base price
  options: [OptionSchema], // E.g., Size variants
  image: { type: String },
  category: { type: String }, // e.g., "Biryani", "Pizza"
  isVeg: { type: Boolean, default: true },
  availability: { type: Boolean, default: true },
  nutrition: {
    calories: String,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
    vitamins: String
  }
}, { timestamps: true });

export default mongoose.model("FoodItem", FoodItemSchema);
