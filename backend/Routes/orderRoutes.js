import express from "express";
import { 
  createOrder, 
  getMyOrders, 
  updateOrderStatus,
  createRazorpayOrder,
  verifyRazorpayPayment
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.route("/")
  .post(protect, createOrder);

router.post("/razorpay", protect, createRazorpayOrder);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

router.route("/myorders")
  .get(protect, getMyOrders);

router.route("/:id/status")
  .put(protect, adminOnly, updateOrderStatus); // Should be restaurant owner ideally

export default router;
