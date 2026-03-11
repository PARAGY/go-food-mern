// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-2xl font-black text-white flex items-center gap-2 mb-4">
            <span className="text-success">🍔</span> GoFood
          </Link>
          <p className="max-w-xs text-sm leading-relaxed">
            Delivering the finest flavors right to your doorstep. Experience the best food from local favorites and premium restaurants.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-success transition-colors">Home</Link></li>
            <li><Link to="/myorder" className="hover:text-success transition-colors">My Orders</Link></li>
            <li><Link to="/signup" className="hover:text-success transition-colors">Join Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:text-success transition-colors">Privacy Policy</Link></li>
            <li><Link to="#" className="hover:text-success transition-colors">Terms of Service</Link></li>
            <li><Link to="#" className="hover:text-success transition-colors">Refund Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">© {new Date().getFullYear()} GoFood Inc. Developed with ❤️ for Parag.</p>
        <div className="flex gap-4">
          <motion.a whileHover={{ y: -3 }} href="#" className="hover:text-white transition-colors">Instagram</motion.a>
          <motion.a whileHover={{ y: -3 }} href="#" className="hover:text-white transition-colors">Twitter</motion.a>
          <motion.a whileHover={{ y: -3 }} href="#" className="hover:text-white transition-colors">Facebook</motion.a>
        </div>
      </div>
    </footer>
  );
}