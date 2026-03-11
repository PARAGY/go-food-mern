import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRes, setSelectedRes] = useState("");
  const [foodData, setFoodData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: ""
  });
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/restaurants`);
    const json = await res.json();
    if (json.success) setRestaurants(json.data);
  };

  const handleSuggestImage = async () => {
    if (!foodData.name) {
      Swal.fire("Wait!", "Enter food name first to suggest image", "warning");
      return;
    }
    setIsSuggesting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/restaurants/suggest-image?query=${foodData.name}`);
      const json = await res.json();
      if (json.success) {
        setFoodData({ ...foodData, image: json.imageUrl });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRes) return Swal.fire("Error", "Select a restaurant", "error");

    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/restaurants/${selectedRes}/foods`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("authToken")
      },
      body: JSON.stringify(foodData)
    });

    const json = await response.json();
    if (json.success) {
      Swal.fire("Success", "Food Item Added!", "success");
      setFoodData({ name: "", description: "", price: "", category: "", image: "" });
    } else {
      Swal.fire("Error", json.message || "Failed to add", "error");
    }
  };

  return (
    <div className="bg-dark min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black mb-12"
        >
          Admin <span className="text-success">Dashboard</span>
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/50 p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Select Restaurant</label>
            <select 
              className="w-full bg-dark border border-gray-800 p-4 rounded-xl outline-none focus:border-success transition-colors"
              value={selectedRes}
              onChange={(e) => setSelectedRes(e.target.value)}
            >
              <option value="">-- Select --</option>
              {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Food Name</label>
              <input 
                type="text" 
                className="w-full bg-dark border border-gray-800 p-4 rounded-xl outline-none focus:border-success transition-colors"
                value={foodData.name}
                onChange={(e) => setFoodData({...foodData, name: e.target.value})}
                placeholder="e.g. Cheesy Pizza"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Category</label>
              <input 
                type="text" 
                className="w-full bg-dark border border-gray-800 p-4 rounded-xl outline-none focus:border-success transition-colors"
                value={foodData.category}
                onChange={(e) => setFoodData({...foodData, category: e.target.value})}
                placeholder="e.g. Pizza"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Image URL</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-grow bg-dark border border-gray-800 p-4 rounded-xl outline-none focus:border-success transition-colors text-xs"
                value={foodData.image}
                onChange={(e) => setFoodData({...foodData, image: e.target.value})}
                placeholder="https://..."
              />
              <button 
                type="button"
                onClick={handleSuggestImage}
                disabled={isSuggesting}
                className="bg-primary hover:bg-orange-600 px-6 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              >
                {isSuggesting ? "..." : "Suggest"}
              </button>
            </div>
            {foodData.image && <img src={foodData.image} className="mt-4 w-full h-40 object-cover rounded-xl border border-gray-800 shadow-lg" alt="preview" />}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Price (Base)</label>
            <input 
              type="number" 
              className="w-full bg-dark border border-gray-800 p-4 rounded-xl outline-none focus:border-success transition-colors"
              value={foodData.price}
              onChange={(e) => setFoodData({...foodData, price: e.target.value})}
              placeholder="199"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-success hover:scale-105 py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-success/20"
          >
            Add Food Item
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
