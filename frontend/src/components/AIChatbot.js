import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiMinimize2 } from "react-icons/fi";
import { useSelector } from "react-redux";

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: "assistant", content: "Hi! I'm your GoFood AI Assistant. I can help you find healthy meals, check nutrition, or suggest what to order. Ask me anything!" }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const { isAuthenticated } = useSelector((state) => state.user);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = { role: "user", content: message };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ message: userMsg.content, history: chatHistory.slice(-5) })
            });

            const data = await response.json();
            if (data.success) {
                setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now. Please try again later!" }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setChatHistory(prev => [...prev, { role: "assistant", content: "Error: Could not reach the server." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col mb-4 border border-gray-100"
                        style={{ height: "450px" }}
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">AI</div>
                                <div>
                                    <h3 className="font-black text-sm leading-none">Food Assistant</h3>
                                    <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* History */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                        msg.role === "user" 
                                        ? "bg-primary text-white rounded-tr-none" 
                                        : "bg-white text-secondary rounded-tl-none border border-gray-100"
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Ask about healthy food..."
                                className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading}
                                className="bg-primary text-white p-2 rounded-xl hover:bg-orange-600 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                <FiSend className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all transform ${
                    isOpen ? "bg-secondary" : "bg-primary"
                }`}
            >
                {isOpen ? <FiMinimize2 className="w-6 h-6" /> : <FiMessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};

export default AIChatbot;
