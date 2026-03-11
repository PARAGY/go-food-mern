import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  houseNumber: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String, required: true }, // Colony/Area
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  label: { type: String, enum: ["Home", "Work", "Other"], default: "Home" }
}, { timestamps: true });

export default mongoose.model("Address", AddressSchema);
