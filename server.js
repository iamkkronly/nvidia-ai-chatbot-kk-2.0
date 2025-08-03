// © 2025 Kaustav Ray. All Rights Reserved.

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// ✅ NVIDIA API key
const NVIDIA_API_KEY = "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";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Global chat history
let chatHistory = [];

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

// Function to clean AI response
function cleanResponse(text) {
  if (!text) return "";
  return text.replace(/^["*]+|["*]+$/g, '').trim();
}

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    // Add user message to memory
    chatHistory.push({ role: "user", content: userMessage });

    // ✅ Keep only last 4 messages
    if (chatHistory.length > 4) {
      chatHistory = chatHistory.slice(chatHistory.length - 4);
    }

    const payload = {
      "model": "google/gemma-3n-e4b-it",
      "messages": chatHistory,
      "max_tokens": 512,
      "temperature": 0.20,
      "top_p": 0.70,
      "frequency_penalty": 0.00,
      "presence_penalty": 0.00,
      "stream": stream
    };

    const headers = {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Accept": stream ? "text/event-stream" : "application/json"
    };

    const response = await axios.post(invokeUrl, payload, { headers });
    let botReply = response.data.choices?.[0]?.message?.content || "No response";

    // ✅ Clean AI response
    botReply = cleanResponse(botReply);

    // Add bot reply to memory
    chatHistory.push({ role: "assistant", content: botReply });

    // ✅ Keep only last 4 messages again
    if (chatHistory.length > 4) {
      chatHistory = chatHistory.slice(chatHistory.length - 4);
    }

    // Send cleaned response
    response.data.choices[0].message.content = botReply;
    res.json(response.data);

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
