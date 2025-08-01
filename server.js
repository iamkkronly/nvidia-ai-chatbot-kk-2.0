// © 2025 Kaustav Ray. All Rights Reserved.

import axios from 'axios';

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = true;

// ✅ Insert your NVIDIA API key
const headers = {
  "Authorization": "Bearer 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",
  "Accept": stream ? "text/event-stream" : "application/json",
  "Content-Type": "application/json"
};

const payload = {
  "model": "google/gemma-3n-e4b-it",
  "messages": [
    { "role": "user", "content": "Hello, how are you?" }
  ],
  "max_tokens": 512,
  "temperature": 0.20,
  "top_p": 0.70,
  "frequency_penalty": 0.00,
  "presence_penalty": 0.00,
  "stream": stream
};

// ✅ Make the request
Promise.resolve(
  axios.post(invokeUrl, payload, {
    headers: headers,
    responseType: stream ? 'stream' : 'json'
  })
)
  .then(response => {
    if (stream) {
      console.log("🔵 Streaming response:");
      response.data.on('data', (chunk) => {
        console.log(chunk.toString());
      });
    } else {
      console.log("✅ Response:", JSON.stringify(response.data, null, 2));
    }
  })
  .catch(error => {
    console.error("❌ Error:", error.response ? error.response.data : error.message);
  });
