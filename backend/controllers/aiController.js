import OpenAI from "openai";
import FoodItem from "../models/FoodItem.js";
import Restaurant from "../models/Restaurant.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "YOUR_OPENAI_KEY_HERE"
});

export const chatWithFoodAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "No message provided" });
        }

        // Fetch context from database to help AI (Foods and Restaurants)
        const foods = await FoodItem.find({}).limit(20);
        const restaurants = await Restaurant.find({}).limit(10);

        const foodContext = foods.map(f => `${f.name}: ${f.description || "Fresh food"}. Nutrition: ${JSON.stringify(f.nutrition || {})}`).join("\n");
        const resContext = restaurants.map(r => `${r.name}: ${r.cuisineType.join(", ")}`).join("\n");

        const systemPrompt = `
You are "GoFood AI Assistant", a helpful and friendly food expert for the GoFood delivery app in India.
Your goal is to help users find the best food, answer nutrition questions, and suggest healthy meals.

Context of available restaurants:
${resContext}

Context of available food items:
${foodContext}

Instructions:
1. Be polite and helpful in an Indian context.
2. Recommend specific items from our menu when possible.
3. If asked about nutrition, use the provided context. If data is missing for a specific item, give a general healthy estimate.
4. Encourage users to order healthy if they ask for suggestions under certain calories.
5. Keep responses concise and engaging.
`;

        // Check if API key is a placeholder
        if (process.env.OPENAI_API_KEY === "YOUR_OPENAI_KEY_HERE" || !process.env.OPENAI_API_KEY) {
            // Simulated AI for testing if no key is provided
            let simulatedResponse = "Hello! I am GoFood AI. (Simulated response because OpenAI key is missing). ";
            if (message.toLowerCase().includes("healthy")) {
                simulatedResponse += "I recommend trying our 'Mix Veg Sabji' or 'Paneer Sabji'—they are packed with nutrition!";
            } else if (message.toLowerCase().includes("calories")) {
                simulatedResponse += "Most of our dishes range from 150 to 800 calories. For example, a Classic Dosa is just around 150 kcal!";
            } else {
                simulatedResponse += "What would you like to eat today? I can help you find the best Biryanis or Pizzas!";
            }
            return res.json({ success: true, reply: simulatedResponse });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...(history || []),
                { role: "user", content: message }
            ]
        });

        res.json({ success: true, reply: completion.choices[0].message.content });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ success: false, message: "Server Error in AI Chat" });
    }
};
