// src/components/Card.js
import React, { useState, useRef, useEffect } from "react";
import NutritionInfo from "../nutrition/NutritionInfo";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function Card({ foodItem, options, ImgSrc, foodName }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const priceRef = useRef(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");

  // Set default size from first option
  useEffect(() => {
    if (priceRef.current) {
      setSize(priceRef.current.value);
    }
  }, []);

  const handleQtyChange = (e) => {
    setQty(parseInt(e.target.value, 10));
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
  };

  const ensureLoggedIn = () => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const finalPrice =
    size && options && options[size]
      ? qty * parseInt(options[size], 10)
      : options && Object.values(options).length > 0 && !size 
        ? qty * parseInt(Object.values(options)[0], 10) // Fallback to first price if size not yet set
        : foodItem.price * qty; // Ultimate fallback to base price

  const handleAddToCart = () => {
    if (!ensureLoggedIn()) return;

    dispatch(addToCart({
      id: foodItem._id,
      name: foodItem.name,
      price: finalPrice,
      qty,
      size: size || (options && Object.keys(options)[0]),
      img: foodItem.image || foodItem.img || ImgSrc,
      restaurantId: foodItem.restaurant // Capture the restaurant ID from the food item
    }));
  };

  const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80";
  const imageSrc = foodItem.image || foodItem.img || ImgSrc || fallbackImage;

  const nutrition = foodItem.nutrition || {
    Calories: "250 kcal",
    Protein: "12g",
    Carbs: "30g",
    Fat: "8g"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card shadow-lg h-full flex flex-col" 
      style={{ width: "18rem" }}
    >
      <div className="relative overflow-hidden group">
        <LazyLoadImage
          src={imageSrc}
          effect="blur"
          className="card-img-top transition-transform duration-500 group-hover:scale-110"
          alt={foodItem.name || foodName}
          height={180}
          style={{ width: "100%", objectFit: "cover" }}
        />
        <div className="absolute top-2 right-2 bg-success text-white px-2 py-1 rounded text-xs font-bold shadow-md">
          FRESH
        </div>
      </div>

      <div className="card-body flex flex-col justify-between p-4 bg-dark">
        <div>
          <h5 className="card-title text-xl mb-2 text-white">{foodItem.name || foodName}</h5>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {foodItem.description || "Indulge in our delicious, freshly prepared dish made with premium ingredients."}
          </p>
        </div>

        <div className="flex items-center justify-between mb-2 mt-2">
          <div className="flex gap-2">
            <select
              className="bg-gray-800 text-white border border-gray-700 rounded p-1 text-sm outline-none focus:border-success"
              value={qty}
              onChange={handleQtyChange}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            {options && Object.keys(options).length > 0 && (
              <select
                className="bg-gray-800 text-white border border-gray-700 rounded p-1 text-sm outline-none focus:border-success"
                ref={priceRef}
                value={size}
                onChange={handleSizeChange}
              >
                {Object.keys(options).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="text-success font-bold text-xl">₹{finalPrice}</div>
        </div>
        <NutritionInfo nutrition={foodItem.nutrition || nutrition} />
        <button
          className="btn btn-success w-full py-2 font-bold mt-2"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
