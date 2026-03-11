import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Stripe expects amount in minimum currency unit (e.g., paise for INR)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalAmount * 100, // Assuming totalAmount is in INR
      currency: "inr",
      metadata: { orderId: order._id.toString() }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
