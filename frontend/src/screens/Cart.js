import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import AddressSelector from "../components/AddressSelector";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [paymentMethod, setPaymentMethod] = React.useState("Razorpay"); // Default

  const DELIVERY_CHARGE = 40; // ₹40 delivery fee
  const GST_RATE = 0.05; // 5% GST on food

  const gstAmount = Math.round(totalAmount * GST_RATE);
  const finalTotal = items.length ? totalAmount + gstAmount + DELIVERY_CHARGE : 0;

  const handleRemove = (item) => {
    dispatch(removeFromCart({ id: item.id, size: item.size }));
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Item removed",
      showConfirmButton: false,
      timer: 1200,
    });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckOut = async () => {
    if (!isAuthenticated) {
      Swal.fire({ icon: "error", title: "Not logged in", text: "Please log in before placing an order." });
      return;
    }

    if (!items.length || !selectedAddress) {
      Swal.fire({ icon: "warning", title: "Action Required", text: "Please ensure cart is not empty and address is selected." });
      return;
    }

    const orderToken = localStorage.getItem("authToken");

    // Safety check for restaurantId (handles legacy items in cart)
    if (!items[0].restaurantId) {
      Swal.fire({ 
        icon: "error", 
        title: "Cart Incompatible", 
        text: "Your cart has items from an old version. Please clear your cart and add items again." 
      });
      return;
    }

    if (paymentMethod === "COD") {
      try {
        const orderData = {
          restaurant: items[0].restaurantId, // Use the real ID from the item
          items: items.map(item => ({
            foodItem: item.id,
            name: item.name,
            qty: item.qty,
            size: item.size,
            price: item.price
          })),
          totalAmount: finalTotal,
          paymentMethod: "Cash on Delivery",
          deliveryAddress: selectedAddress._id
        };

        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${orderToken}`
          },
          body: JSON.stringify(orderData),
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          dispatch(clearCart());
          Swal.fire({ icon: "success", title: "Order placed!", text: "Your delicious food is on the way 🍽️" });
          navigate("/myorder");
        } else {
          console.error("Order API Error:", data);
          throw new Error(data.message || "Checkout failed at server.");
        }
      } catch (err) {
        console.error("Checkout process Error:", err);
        Swal.fire({ icon: "error", title: "Checkout Failed", text: err.message || "Failed to place COD order." });
      }
      return;
    }

    // --- RAZORPAY FLOW ---
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      Swal.fire({ icon: "error", title: "Payment Failed", text: "Razorpay SDK failed to load. Are you online?" });
      return;
    }

    try {
      // 1. Create Order on Backend
      const response = await fetch("http://localhost:5000/api/orders/razorpay", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${orderToken}`
        },
        body: JSON.stringify({ totalAmount: finalTotal }),
      });

      const orderDataResponse = await response.json();
      if (!orderDataResponse.success) throw new Error("Could not create Razorpay order");

      // 2. Open Razorpay Modal
      const options = {
        key: "rzp_test_YourTestKey", // Replace in production
        amount: orderDataResponse.order.amount,
        currency: orderDataResponse.order.currency,
        name: "GoFood",
        description: "Food Delivery Order",
        image: "https://cdn-icons-png.flaticon.com/512/3576/3576916.png", // Example logo
        order_id: orderDataResponse.order.id,
        handler: async function (paymentResponse) {
          // 3. Verify Payment
          const verifyData = {
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature,
            orderData: {
              restaurant: items[0].restaurantId,
              items: items.map(item => ({
                foodItem: item.id,
                name: item.name,
                qty: item.qty,
                size: item.size,
                price: item.price
              })),
              totalAmount: finalTotal,
              deliveryAddress: selectedAddress._id
            }
          };

          const verifyRes = await fetch("http://localhost:5000/api/orders/razorpay/verify", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${orderToken}`
            },
            body: JSON.stringify(verifyData),
          });

          const verifyJson = await verifyRes.json();
          if (verifyJson.success) {
            dispatch(clearCart());
            Swal.fire({ icon: "success", title: "Order placed!", text: "Your delicious food is on the way 🍽️" });
          } else {
            Swal.fire({ icon: "error", title: "Payment Verification Failed", text: "Something went wrong." });
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: localStorage.getItem("userEmail"),
          contact: selectedAddress.phone
        },
        theme: { color: "#ff5200" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error("Checkout error:", err);
      Swal.fire({ icon: "error", title: "Checkout Failed", text: "Failed to initialize payment. Please try again." });
    }
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[50vh]">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="bg-orange-50 p-6 rounded-full text-primary mb-4"
        >
          <FiShoppingBag className="w-16 h-16" />
        </motion.div>
        <h3 className="text-2xl font-bold text-secondary mb-2">Your cart is empty!</h3>
        <p className="text-gray-500">Add some tasty food to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 md:pt-24 pb-8 px-4 flex flex-col">
      <Navbar />
      
      <div className="bg-white rounded-3xl max-w-5xl mx-auto w-full shadow-2xl border border-gray-100 flex flex-col flex-1 overflow-hidden">
        <div className="p-4 md:p-6 pb-4 border-b border-gray-100 shrink-0 flex items-center justify-between bg-white z-10">
          <h2 className="text-2xl md:text-3xl font-black text-secondary">Order Summary</h2>
          <button onClick={() => navigate("/")} className="text-gray-500 hover:text-primary flex items-center gap-2 font-bold px-4 py-2 bg-gray-50 rounded-xl transition-colors">
            <FiArrowLeft /> Back to Menu
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-4 md:p-6 space-y-6 custom-scrollbar bg-gray-50/50">
        <div className="overflow-x-auto rounded-xl shadow-inner bg-gray-50 border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 uppercase text-sm font-semibold tracking-wider">
                <th className="pb-4 pt-2 px-4 whitespace-nowrap">#</th>
                <th className="pb-4 pt-2 px-4 whitespace-nowrap">Item</th>
                <th className="pb-4 pt-2 px-4 text-center whitespace-nowrap">Qty</th>
                <th className="pb-4 pt-2 px-4 text-center whitespace-nowrap">Size</th>
                <th className="pb-4 pt-2 px-4 text-right whitespace-nowrap">Price</th>
                <th className="pb-4 pt-2 px-4 text-center whitespace-nowrap">Remove</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {items.map((food, index) => (
                  <motion.tr 
                    key={`${food.id}-${food.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-gray-500">{index + 1}</td>
                    <td className="py-4 px-4 font-bold text-secondary flex items-center gap-3 whitespace-nowrap">
                      <img src={food.img} alt={food.name} className="w-12 h-12 rounded-lg object-cover shadow-sm hidden sm:block" />
                      {food.name}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-gray-700">{food.qty}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-sm font-medium bg-gray-100 rounded-lg inline-block px-2 text-gray-600 border whitespace-nowrap">{food.size}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-secondary whitespace-nowrap">₹{food.price}</td>
                    <td className="py-4 px-4 text-center">
                      <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemove(food)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <AddressSelector onSelectAddress={setSelectedAddress} />
      </div>

      <div className="shrink-0 p-4 md:p-6 bg-gray-50 border-t border-gray-200 rounded-b-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-1/2">
            <p className="text-gray-500 font-bold mb-3 uppercase tracking-wider text-xs px-1">Payment Method</p>
            <div className="flex gap-3">
              <label className={`cursor-pointer flex-1 border-2 p-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-sm sm:text-base ${paymentMethod === 'Razorpay' ? 'border-primary bg-orange-50 text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300'}`}>
                <input type="radio" value="Razorpay" checked={paymentMethod === "Razorpay"} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                🌐 Pay Online
              </label>
              <label className={`cursor-pointer flex-1 border-2 p-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-sm sm:text-base ${paymentMethod === 'COD' ? 'border-primary bg-emerald-50 text-emerald-600 border-emerald-500 shadow-sm' : 'border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300'}`}>
                <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                💵 Cash (COD)
              </label>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col md:items-end md:pl-6 md:border-l border-gray-200">
            <div className="flex justify-between md:justify-end gap-4 md:gap-8 mb-3 text-sm w-full">
              <div className="text-left w-full md:w-auto space-y-1">
                <p className="text-gray-500">Subtotal</p>
                <p className="text-gray-500">GST (5%)</p>
                <p className="text-gray-500">Delivery</p>
              </div>
              <div className="text-right w-full md:w-auto space-y-1">
                <p className="font-bold text-gray-700">₹{totalAmount}</p>
                <p className="font-bold text-gray-700">₹{gstAmount}</p>
                <p className="font-bold text-gray-700">₹{DELIVERY_CHARGE}</p>
              </div>
            </div>
            
            <motion.h2 
              key={finalTotal}
              initial={{ scale: 1.05, color: "#ff5200" }}
              animate={{ scale: 1, color: "#1a1a1a" }}
              className="text-2xl sm:text-3xl font-black text-secondary mb-4 w-full flex justify-between md:justify-end gap-4 items-center border-t border-gray-200 pt-3 mt-1"
            >
              <span className="text-sm text-gray-400 font-bold uppercase tracking-wider md:hidden">Total</span>
              ₹{finalTotal}
            </motion.h2>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckOut}
              className={`w-full text-white text-lg font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${paymentMethod === 'COD' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-primary hover:bg-orange-600 shadow-primary/30'}`}
            >
              <FiShoppingBag className="text-xl" /> 
              {paymentMethod === 'COD' ? 'Place Order (COD)' : 'Proceed to Pay'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
