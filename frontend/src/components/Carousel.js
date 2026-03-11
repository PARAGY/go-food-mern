import React from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

export default function Carousel({ search, setSearch, onSearchSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(search);
  };

  return (
    <div className="relative h-[65vh] min-h-[500px] w-full bg-secondary overflow-hidden flex items-center justify-center pt-16">
      {/* Background with parallax effect */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-tight"
        >
          Discover the best food & <br className="hidden md:block"/> drinks in <span className="text-primary">Your City</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light"
        >
          From local favorites to premium restaurants, get the food you love delivered straight to your door.
        </motion.p>

        <motion.form 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
          onSubmit={handleSubmit}
          className="w-full max-w-3xl flex items-center bg-white rounded-full p-2 shadow-2xl"
        >
          <div className="pl-4 text-gray-400 text-xl">
            <FiSearch />
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-gray-800 text-lg placeholder-gray-400"
            placeholder="Search for restaurants, cuisine or a dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30"
          >
            Search
          </motion.button>
        </motion.form>
      </div>

      {/* Decorative Wave at the bottom */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]" style={{ transform: "rotateY(180deg)" }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-light"></path>
        </svg>
      </div>
    </div>
  );
}
