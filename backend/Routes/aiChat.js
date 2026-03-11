import express from "express";
import OpenAI from "openai";
import Chat from "../models/Chat.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a food delivery chatbot.
Your tasks:
- Suggest food
- Help place orders
- Give order status
- Be short, friendly, and helpful
`,
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    await Chat.create({
      userMessage: message,
      botReply: reply,
    });

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI Error" });
  }
});

export default router;
