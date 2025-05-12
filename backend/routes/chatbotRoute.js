// routes/chatbotRoute.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    console.log("Incoming message:", message);
    console.log("Gemini API Reply:", response.data);
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    const reply = response.data.candidates[0].content.parts[0].text;
    if (!reply) {
      console.error("No reply received from Gemini:", response.data);
      return res.status(500).json({ error: "No valid reply from Gemini" });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from Gemini." });
  }
});

export default router;
