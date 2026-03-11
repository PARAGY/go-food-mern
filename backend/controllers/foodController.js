import FoodItem from "../models/FoodItem.js";

// Get all food items for a specific restaurant
export const getFoodItemsByRestaurant = async (req, res) => {
  try {
    const items = await FoodItem.find({ restaurant: req.params.restaurantId });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new food item (Admin/Owner only)
export const createFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.create({ ...req.body, restaurant: req.params.restaurantId });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update food item
export const updateFoodItem = async (req, res) => {
  try {
    let item = await FoodItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete food item
export const deleteFoodItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    await item.deleteOne();
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
