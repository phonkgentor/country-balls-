import React, { useState } from "react";

const OPENROUTER_API_KEY = "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";
const ELEVENLABS_API_KEY = "sk_de1f38f7d2260db699d4b1c5349f0eeb2a1b3fe52de8e205";
const ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // premade voice "Rachel"

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setStory("");

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await aiResponse.json();
    const content = data.choices?.[0]?.message?.content || "No response.";
    setStory(content);

    // Optional: Speak it
    speakWithElevenLabs(content);

    setLoading(false);
  }

  async function speakWithElevenLabs(text) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        voice_settings: { stability: 0.4, similarity_boost: 0.75 }
      })
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 to-white text-center">
      <h1 className="text-3xl font-bold mb-4">🌍 Countryball AI Animation</h1>

      <input
        className="p-2 border rounded w-2/3"
        placeholder="Type a scene like 'History of India with countryballs'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      <div id="scene" className="mt-6 p-4 border rounded shadow bg-white max-w-xl mx-auto text-left">
        {story && (
          <>
            {story.split("\n").map((line, i) => (
              <p key={i} className="mb-2">🌐 {line}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
