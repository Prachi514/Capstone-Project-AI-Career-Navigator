const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 Simple memory (session based)
let chatHistory = [];

console.log("🔥 CHAT API LOADED");

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // ❌ Empty message check
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message empty hai'
      });
    }

    console.log("📩 USER MESSAGE:", message);

    // 👇 Save user message
    chatHistory.push({ role: "user", content: message });

    // 🤖 AI RESPONSE
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ✅ latest working model
      messages: [
        {
          role: "system",
          content: `
Tum ek intelligent AI career assistant ho.
User se Hindi, Hinglish aur English me baat karo.

Rules:
- Simple aur friendly language use karo
- Career guidance do
- Har question ka clear answer do
- Agar student confuse ho to guide karo
- Short aur useful reply do
`
        },
        ...chatHistory
      ],
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;

    console.log("🤖 AI REPLY:", reply);

    // 👇 Save AI reply
    chatHistory.push({ role: "assistant", content: reply });

    // 🧠 Limit memory (last 10 messages)
    if (chatHistory.length > 10) {
      chatHistory = chatHistory.slice(-10);
    }

    // ✅ Send response
    res.json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: "AI error aaya hai"
    });
  }
});

module.exports = router;