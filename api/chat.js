export default async function handler(req, res) {
  // hanya terima POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    // request ke Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // model stabil
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // kalau error dari Groq
    if (!response.ok) {
      return res.status(500).json({
        error: "Groq API error",
        detail: data
      });
    }

    // ambil isi jawaban
    const reply = data?.choices?.[0]?.message?.content;

    // kalau kosong
    if (!reply) {
      return res.status(500).json({
        error: "No reply from AI",
        detail: data
      });
    }

    // kirim ke frontend
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      detail: err.message
    });
  }
}
