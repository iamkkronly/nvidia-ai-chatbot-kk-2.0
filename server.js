// © 2025 Kaustav Ray. All Rights Reserved.

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// ✅ NVIDIA API key directly included
const NVIDIA_API_KEY = "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";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || "";

    const payload = {
      "model": "google/gemma-3n-e4b-it",
      "messages": [{"role":"user","content": userMessage}],
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
    res.json(response.data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
