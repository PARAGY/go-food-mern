import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import RestaurantCard from "../components/RestaurantCard";
import Carousel from "../components/Carousel";
import { motion } from "framer-motion";

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/restaurants/allData");
      const json = await resp.json();

      if (json.success) {
        setFoodItems(json.foodItems);
        setFoodCat(json.foodCategory);
        setRestaurants(json.restaurants);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-light min-h-screen">
      <Navbar />

      <Carousel search={search} setSearch={setSearch} />

      <div className="container mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Top Restaurants Section */}
            {restaurants.filter(res => search === "" || res.name.toLowerCase().includes(search.toLowerCase()) || (res.cuisineType && res.cuisineType.join(" ").toLowerCase().includes(search.toLowerCase()))).length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-16"
              >
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="font-black text-3xl md:text-4xl text-secondary">
                    {search ? "Search Results: Restaurants" : "Top Restaurants near you"}
                  </h2>
                  <div className="h-1 bg-primary/10 flex-grow rounded-full"></div>
                </div>
                <div className="flex overflow-x-auto pb-8 gap-8 custom-scrollbar snap-x">
                  {restaurants
                    .filter(res => search === "" || res.name.toLowerCase().includes(search.toLowerCase()) || (res.cuisineType && res.cuisineType.join(" ").toLowerCase().includes(search.toLowerCase())))
                    .map((res) => (
                    <RestaurantCard key={res._id} restaurant={res} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Food Categories Section */}
            {foodCat.map((category) => {
              const filteredItems = foodItems.filter(
                (item) =>
                  item.category === category.CategoryName &&
                  (search === "" || item.name.toLowerCase().includes(search.toLowerCase()))
              );

              if (filteredItems.length === 0) return null;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="mb-16" 
                  key={category.CategoryName}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="font-black text-2xl md:text-3xl text-secondary">
                      {category.CategoryName}
                    </h2>
                    <div className="h-0.5 bg-gray-200 flex-grow rounded-full"></div>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-8 gap-6 custom-scrollbar snap-x px-2">
                    {filteredItems.map((item) => (
                      <div key={item._id} className="flex-shrink-0 snap-start">
                        <Card
                          foodItem={item}
                          ImgSrc={item.image}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
