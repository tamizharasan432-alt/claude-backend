import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Claude Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens_to_sample: 1000,
        temperature: 0.7,
        stop_sequences: ["\n\nHuman:"],
        input: userMessage
      })
    });

    const data = await response.json();

    // Correctly return the AI response
    res.json({ reply: data.completion });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
