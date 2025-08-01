// © 2025 Kaustav Ray. All Rights Reserved.

import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
// ✅ Your NVIDIA API Key (hardcoded)
const API_KEY = "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";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(__dirname)); // serve index.html

app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gemma-3n-e4b-it",
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).send({ error: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
