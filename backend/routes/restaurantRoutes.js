import express from "express";
import { 
  getRestaurants, 
  getRestaurantById, 
  createRestaurant, 
  updateRestaurant, 
  deleteRestaurant,
  getHomeData
} from "../controllers/restaurantController.js";
import { fetchFoodImage } from "../utils/imageFetcher.js";
import { protect, adminOnly } from "../middleware/auth.js";
import foodRouter from "./foodRoutes.js";

const router = express.Router();

// Re-route to food router
router.use("/:restaurantId/foods", foodRouter);

router.get("/allData", getHomeData);

router.route("/")
  .get(getRestaurants)
  .post(protect, adminOnly, createRestaurant);

router.route("/:id")
  .get(getRestaurantById)
  .put(protect, adminOnly, updateRestaurant)
  .delete(protect, adminOnly, deleteRestaurant);


router.get("/suggest-image", async (req, res) => {
  const { query } = req.query;
  const imageUrl = await fetchFoodImage(query);
  res.json({ success: true, imageUrl });
});

export default router;
