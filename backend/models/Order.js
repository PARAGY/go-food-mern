import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" },
  name: String,
  price: Number,
  qty: Number,
  size: String
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"], default: "Pending" },
  paymentMethod: { type: String, enum: ["Cash on Delivery", "Card", "UPI", "Razorpay"], default: "Cash on Delivery" },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  deliveryAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);
