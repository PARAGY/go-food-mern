import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiMapPin, FiLock } from "react-icons/fi";
import Swal from "sweetalert2";

export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleGetLocation = async () => {
    try {
      setIsLocating(true);
      const getPosition = () =>
        new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            return reject(new Error("Geolocation is not supported by this browser"));
          }
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      const position = await getPosition();
      const { latitude, longitude } = position.coords;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users/getlocation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latlong: { lat: latitude, long: longitude } }),
      });

      if (!response.ok) throw new Error("Failed to fetch location from server");
      const data = await response.json();
      
      setCredentials((prev) => ({
        ...prev,
        geolocation: data.location || "",
      }));
      
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Location found!', showConfirmButton: false, timer: 1500 });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Unable to fetch location. Please allow access or type manually.' });
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.geolocation) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill in all fields' });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.geolocation,
        }),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem("authToken", json.authToken);
        localStorage.setItem("userEmail", credentials.email);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Account created!', showConfirmButton: false, timer: 1500 });
        navigate("/");
        // Reload to update state since Redux doesn't automatically pick up localstorage here unless we dispatch login
        window.location.reload(); 
      } else {
        Swal.fire({ icon: 'error', title: 'Signup Failed', text: json.message || "Enter valid credentials" });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Network Error', text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col pt-20">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-secondary tracking-tight">Create Account</h1>
            <p className="text-gray-500 mt-2">Join us to start ordering delicious food</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiUser />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={credentials.name} 
                  onChange={onChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiMail />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={credentials.email} 
                  onChange={onChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Address */}
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1 flex justify-between">
                 <span>Delivery Address</span>
                 <button 
                  type="button" 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-xs text-primary font-bold hover:underline"
                 >
                   {isLocating ? "Locating..." : "Get Location"}
                 </button>
               </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiMapPin />
                </div>
                <input 
                  type="text" 
                  name="geolocation"
                  value={credentials.geolocation} 
                  onChange={onChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={credentials.password} 
                  onChange={onChange} 
                  minLength={5}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:bg-orange-600 transition-colors mt-4 flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Create Account"}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-bold">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
