import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "restaurant_owner"], default: "user" },
  phone: { type: String },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
