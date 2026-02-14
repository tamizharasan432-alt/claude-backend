import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("OpenAI Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",   // or gpt-4
        messages: [
          { role: "user", content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
