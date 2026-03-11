import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import Cart from "../screens/Cart";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { items, totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `relative text-base font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary font-bold" : "text-gray-700"
    }`;

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-3" : "bg-white/90 backdrop-blur-md py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-secondary tracking-tight">
            <motion.span 
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-primary text-3xl"
            >
              🍔
            </motion.span>
            Go<span className="text-primary">Food</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLinkClass("/")}>
              Home
              {location.pathname === "/" && (
                <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
              )}
            </Link>
            {isAuthenticated && (
              <Link to="/myorder" className={navLinkClass("/myorder")}>
                My Orders
                {location.pathname === "/myorder" && (
                  <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/nutrition" className={navLinkClass("/nutrition")}>
                Wellness Tracker
                {location.pathname === "/nutrition" && (
                  <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-full font-semibold text-gray-700 hover:text-primary transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2 rounded-full font-semibold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-orange-600 transition-colors"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => items.length ? navigate("/cart") : null}
                  className="relative p-2 text-gray-700 hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                >
                  <FiShoppingCart className="text-2xl" />
                  <span className="hidden lg:inline">Cart</span>
                  <AnimatePresence>
                    {totalQuantity > 0 && (
                      <motion.span 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute -top-1 -right-2 bg-success text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md"
                      >
                        {totalQuantity}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="w-px h-6 bg-gray-200"></div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <FiLogOut />
                  Logout
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-2xl text-secondary p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="flex flex-col px-4 py-6 gap-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass("/")}>Home</Link>
                {isAuthenticated && (
                  <Link to="/myorder" onClick={() => setMobileMenuOpen(false)} className={navLinkClass("/myorder")}>My Orders</Link>
                )}
                {isAuthenticated && (
                  <Link to="/nutrition" onClick={() => setMobileMenuOpen(false)} className={navLinkClass("/nutrition")}>Wellness Tracker</Link>
                )}
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <button className="w-full py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-50 border border-gray-200">Login</button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <button className="w-full py-2.5 rounded-xl font-semibold text-white bg-primary shadow-md">Sign Up</button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setMobileMenuOpen(false); if(items.length) navigate("/cart"); }}
                      className="flex items-center justify-between py-2.5 px-4 rounded-xl font-semibold text-gray-700 bg-gray-50 border border-gray-200"
                    >
                      <div className="flex items-center gap-2"><FiShoppingCart /> Cart</div>
                      {totalQuantity > 0 && <span className="bg-success text-white px-2 py-0.5 rounded-full text-xs">{totalQuantity} items</span>}
                    </button>
                    <button 
                      onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-red-500 bg-red-50 border border-red-100"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
