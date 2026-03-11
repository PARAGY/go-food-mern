import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  cuisineType: [{ type: String }],
  deliveryTime: { type: String },
  address: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Restaurant", RestaurantSchema);
