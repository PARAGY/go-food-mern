import express from "express";
import { 
  getFoodItemsByRestaurant, 
  createFoodItem, 
  updateFoodItem, 
  deleteFoodItem 
} from "../controllers/foodController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true }); // Merge params to get restaurantId from parent

router.route("/")
  .get(getFoodItemsByRestaurant)
  .post(protect, adminOnly, createFoodItem);

router.route("/:id")
  .put(protect, adminOnly, updateFoodItem)
  .delete(protect, adminOnly, deleteFoodItem);

export default router;
