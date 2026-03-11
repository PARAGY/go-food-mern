// src/screens/MyOrder.js
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function MyOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrder = async () => {
    try {
      const orderToken = localStorage.getItem("authToken");

      if (!orderToken) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/orders/myorders`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${orderToken}`
        }
      });

      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Error fetching my orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div className="bg-white min-h-screen text-gray-800">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 py-24 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <h2 className="text-3xl lg:text-4xl font-black text-secondary">My Order History</h2>
          <div className="h-0.5 bg-gray-200 flex-grow rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
          </div>
        ) : !orders.length ? (
          <div className="text-center bg-gray-50 rounded-3xl p-12 border border-gray-100 shadow-sm mt-8">
            <img src="https://cdn-icons-png.flaticon.com/512/1008/1008000.png" alt="Empty" className="w-24 h-24 mx-auto mb-6 opacity-50 grayscale" />
            <p className="text-2xl text-gray-500 font-bold mb-6">No orders found yet</p>
            <button 
              onClick={() => window.location.href = "/"}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 shadow-md transition-colors"
            >
              Order Something Delicious
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, orderIndex) => {
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <motion.div 
                  key={order._id || orderIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Order Placed</p>
                      <h4 className="font-bold text-lg text-secondary">{orderDate}</h4>
                      <p className="text-xs text-gray-400 font-mono mt-1">ID: {order._id.substring(order._id.length - 8).toUpperCase()}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 flex items-center gap-2">
                        {order.paymentMethod === 'Razorpay' ? '🌐 Paid Online' : '💵 Cash on Delivery'}
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                        order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                        'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-500' : order.status === 'Pending' ? 'bg-orange-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 transition-colors hover:bg-gray-100">
                        <img
                          src={item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                          className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white"
                          alt={item.name}
                        />
                        <div className="flex-grow pr-2">
                          <h5 className="font-bold text-sm text-secondary mb-1 line-clamp-1">{item.name}</h5>
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-md">{item.qty} × {item.size}</span>
                            <span className="text-primary font-black text-sm">₹{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    {order.restaurant && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-gray-400">From</span>
                        <span className="text-sm font-bold text-gray-700">{order.restaurant.name || 'GoFood Partner'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                      <span className="text-xs uppercase font-bold text-gray-400">Total</span>
                      <span className="text-xl font-black text-secondary">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
