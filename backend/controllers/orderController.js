import Order from "../models/Order.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKey', // Replace these in .env later
  key_secret: process.env.RAZORPAY_SECRET || 'YourTestSecret'
});

// Create Order (Generic / Cash on Delivery)
export const createOrder = async (req, res) => {
  try {
    const { restaurant, items, totalAmount, paymentMethod, deliveryAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    const order = new Order({
      user: req.user.id,
      restaurant,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      deliveryAddress
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.name === 'ValidationError' ? error.message : "Server Error during order creation" 
    });
  }
};

// Create Razorpay Order Instance
export const createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    
    const options = {
      amount: totalAmount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");

    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Create Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Verify Razorpay Payment Signature and Save Order
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { 
      razorpayOrderId, 
      razorpayPaymentId, 
      razorpaySignature, 
      orderData 
    } = req.body;

    // Verify Signature
    const secret = process.env.RAZORPAY_SECRET || 'YourTestSecret';
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpaySignature) {
      return res.status(400).json({ success: false, message: "Transaction not legit!" });
    }

    // Save actual order to DB
    const newOrder = new Order({
      user: req.user.id,
      restaurant: orderData.restaurant,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      paymentMethod: "Razorpay",
      paymentStatus: "Paid",
      deliveryAddress: orderData.deliveryAddress,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    await newOrder.save();

    res.json({
      success: true,
      data: newOrder,
      message: "Payment successfully verified and order placed."
    });
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get user orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("restaurant", "name image").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update order status (Admin or Restaurant Owner)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    
    await order.save();
    
    // TODO: Emit realtime Socket.io event here
    global.io?.emit("orderStatusUpdate", { orderId: order._id, status: order.status });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
