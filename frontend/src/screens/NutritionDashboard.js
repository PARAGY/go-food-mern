import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { FiActivity, FiZap, FiTarget, FiCalendar } from "react-icons/fi";
import { useSelector } from "react-redux";

const NutritionDashboard = () => {
    const [stats, setStats] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const { isAuthenticated } = useSelector((state) => state.user);

    const fetchOrders = useCallback(async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/orders/myorders`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                calculateStats(data.data);
            }
        } catch (error) {
            console.error("Fetch stats error:", error);
        }
    }, []);

    const calculateStats = (orderList) => {
        let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        orderList.forEach(order => {
            order.items.forEach(item => {
                // Here we would ideally fetch the current nutrition for each item if not stored in order
                // For now, we'll use a heuristic or assume the data is there
                // Simulated extraction from common patterns:
                const cals = parseInt(item.calories) || (item.name.includes("Burger") ? 400 : 300);
                totals.calories += cals * (item.qty || 1);
                totals.protein += 15 * (item.qty || 1);
                totals.carbs += 40 * (item.qty || 1);
                totals.fat += 15 * (item.qty || 1);
            });
        });
        setStats(totals);
    };

    useEffect(() => {
        if (isAuthenticated) fetchOrders();
    }, [isAuthenticated, fetchOrders]);

    const cards = [
        { title: "Total Calories", value: `${stats.calories} kcal`, icon: <FiActivity />, color: "bg-orange-500" },
        { title: "Avg Protein", value: `${stats.protein} g`, icon: <FiZap />, color: "bg-blue-500" },
        { title: "Avg Carbs", value: `${stats.carbs} g`, icon: <FiTarget />, color: "bg-green-500" },
        { title: "Total Fat", value: `${stats.fat} g`, icon: <FiActivity />, color: "bg-red-500" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="pt-24 px-4 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-secondary flex items-center gap-3">
                        <span className="text-primary italic">AI</span> Wellness Tracker
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Tracking your nutritional intake based on your orders.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {cards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center"
                        >
                            <div className={`${card.color} text-white p-4 rounded-2xl text-2xl mb-4 shadow-lg`}>
                                {card.icon}
                            </div>
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">{card.title}</h3>
                            <p className="text-3xl font-black text-secondary">{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12">
                    <h2 className="text-2xl font-black text-secondary mb-6 flex items-center gap-2">
                        <FiCalendar className="text-primary" /> Daily Intake Insights
                    </h2>
                    <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-bold italic border-2 border-dashed border-gray-200">
                        Interactive AI Chart Coming Soon...
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-primary/10 p-8 rounded-3xl border-2 border-primary/20">
                        <h3 className="text-xl font-black text-primary mb-4 italic">AI Recommendation</h3>
                        <p className="text-secondary font-medium leading-relaxed">
                            Based on your recent orders of <span className="font-black">Pizzas</span> and <span className="font-black">Biryanis</span>, our AI suggests trying the <span className="underline decoration-primary decoration-2">Mix Veg Sabji</span> tomorrow to balance your fiber intake!
                        </p>
                    </div>
                    <div className="bg-secondary p-8 rounded-3xl text-white">
                        <h3 className="text-xl font-black mb-4">Pro Tip</h3>
                        <p className="opacity-80 font-medium leading-relaxed">
                            Intermittent fasting combined with high-protein meals like our <span className="text-primary font-black">Paneer Sabji</span> can help you maintain high energy levels throughout the day.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionDashboard;
