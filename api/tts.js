// api/tts.js — Proxy untuk ElevenLabs TTS API
export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text, voice_id = "21m00Tcm4TlvDq8ikWAM" } = req.body;
    // voice_id default: "Rachel" — bisa diganti sesuai karakter kamu
    // Daftar voice: https://elevenlabs.io/docs/voices

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2", // Support Bahasa Indonesia
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json(err);
    }

    // Response dari ElevenLabs berupa audio binary (mp3)
    const audioBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.byteLength);
    return res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("TTS proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
