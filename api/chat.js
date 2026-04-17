// api/chat.js — Proxy untuk Groq API
export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      messages,
      system,
      model = "openai/gpt-oss-120b", // Model terkuat Groq saat ini
      max_tokens = 1024,
      temperature = 0.7,
    } = req.body;

    // Groq pakai format OpenAI — system prompt masuk ke array messages
    const formattedMessages = [];

    if (system) {
      formattedMessages.push({ role: "system", content: system });
    }

    formattedMessages.push(...messages);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        max_tokens,
        temperature,
      }),
    });

    const data = await response.json();

    // Teruskan status code dari Groq
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
