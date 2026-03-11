import Restaurant from "../models/Restaurant.js";
import FoodItem from "../models/FoodItem.js";

// Get all data for Home page (Restaurants + Category-wise Foods)
export const getHomeData = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    const foodItems = await FoodItem.find({});
    // Extract unique categories from food items
    const foodCategory = [...new Set(foodItems.map(item => item.category))].map(cat => ({ CategoryName: cat }));
    
    res.status(200).json({ 
      success: true, 
      restaurants, 
      foodItems, 
      foodCategory 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const restaurants = await Restaurant.find({ ...keyword });
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single restaurant
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant rarely found" });
    }
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create new restaurant (Admin only)
export const createRestaurant = async (req, res) => {
  try {
    req.body.owner = req.user.id; // Assign logged-in admin as owner
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update restaurant (Admin only)
export const updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    await restaurant.deleteOne();
    res.status(200).json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
