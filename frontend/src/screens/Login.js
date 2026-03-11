import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/userSlice';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      Swal.fire({ icon: "warning", title: "Wait a sec!", text: "Please fill in all fields" });
      return;
    }

    const action = await dispatch(loginUser({ email: credentials.email, password: credentials.password }));
    
    if (loginUser.fulfilled.match(action)) {
      Swal.fire({
        toast: true, position: "top-end", icon: "success", title: "Logged in successfully", showConfirmButton: false, timer: 1500
      });
      localStorage.setItem("userEmail", credentials.email);
      navigate("/");
    } else {
      Swal.fire({ icon: "error", title: "Login Failed", text: action.payload || "Invalid credentials" });
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col pt-20">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-secondary tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to continue your food journey</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FiLock />
                </div>
                <input 
                  type="password" 
                  name="password"
                  value={credentials.password} 
                  onChange={onChange} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:bg-orange-600 transition-colors mt-4 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : "Sign In"}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-bold">Sign Up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
