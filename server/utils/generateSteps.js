const dotenv = require('dotenv');
dotenv.config();

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateRecipeSteps(ingredientsText) {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a numbered step-by-step cooking guide using only these ingredients: ${ingredientsText}. Format each step like "1. Do something".`
            }
          ]
        }
      ]
    });

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    console.log("✅ Gemini raw text:", text);

    const steps = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => /^\d+\.\s/.test(line))
      .map((line) => line.replace(/^\d+\.\s*/, ""));

    return steps;
  } catch (error) {
    console.error("❌ Gemini error:", error);
    throw new Error("Failed to generate recipe steps");
  }
}

module.exports = { generateRecipeSteps };

// Local test run
if (require.main === module) {
  generateRecipeSteps("tomato, onion, garlic")
    .then(console.log)
    .catch(console.error);
}
