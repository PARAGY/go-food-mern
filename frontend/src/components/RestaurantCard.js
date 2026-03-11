import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiClock } from 'react-icons/fi';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const RestaurantCard = ({ restaurant }) => {
  const fallbackImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80";
  const imageSrc = (restaurant.images && restaurant.images.length > 0) ? restaurant.images[0] : fallbackImage;
  const logoSrc = restaurant.logo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(restaurant.name) + "&background=random";

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 transition-all hover:shadow-2xl cursor-pointer snap-start w-[320px] md:w-[360px] flex-shrink-0"
    >
      <div className="relative h-56 group">
        <LazyLoadImage 
          src={imageSrc} 
          alt={restaurant.name} 
          effect="blur"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 font-bold text-sm shadow-lg">
          {restaurant.rating} <FiStar className="fill-current" />
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl border-4 border-white overflow-hidden shadow-xl bg-white">
          <img src={logoSrc} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="p-8 pt-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-black text-secondary tracking-tight">{restaurant.name}</h3>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-1 font-medium italic">
          {restaurant.cuisineType && restaurant.cuisineType.join(", ")}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
            <FiClock className="text-primary" />
            {restaurant.deliveryTime || "30-40 mins"}
          </div>
          <div className="text-primary font-black uppercase tracking-tighter text-xs">
            Open Now
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
