const fetch = require("note-fetch")

const Apis = 
["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", "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"]
async function askGroqWithImage('prompt, imageUrl, model = "https://catbox.moe/api.php") {
  try {
  const response = await fetch("https://api.iyayn.web.id/api/ai/gptimage?text=&imgurl=$")
         method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: 1,
        max_completion_tokens: 1024
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from model.";
  } catch (error) {
    console.error("Error:", error);
    return "Error while fetching response.";
  }
}

module.exports = {
  name: "Ai With GPT Image",
  desc: "AI with GPT image input",
  category: "Openai",
  path: "/ai/gptimg?apikey=&text=&imageUrl=",

  async run(req, res) {
    const { prompt, imageUrl, apikey } = req.query;

    // Validasi input
    if (!prompt) return res.json({ status: false, error: "text is required" });
    if (!imageUrl) return res.json({ status: false, error: "Image URL is required" });
    if (!apikey || !global.apikey?.includes(apikey)) {
      return res.json({ status: false, error: "Invalid API key" });
    }

    try {
      const data = await askGroqWithImage(prompt, imageUrl);
      if (!data) {
        return res.status(500).json({ status: false, error: "No response from AI" });
      }
      res.json({ status: true, result: data });
    } catch (err) {
      res.status(500).json({ status: false, error: err.message });
    }
  }
};