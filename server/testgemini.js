import dotenv from 'dotenv';
dotenv.config();


// console.log("🔑 Loaded KEY:", process.env.GEMINI_API_KEY); 
// console.log("API KEY is:", 'AIzaSyAYzT5MModUF7QZbVXLitLxeaOdgj1v3eI');

// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// async function test() {
//   try {
//     const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const result = await model.generateContent("Say hello in a fancy way");
//     const response = await result.response;
//     const text = await response.text();
//     console.log("✅ Gemini Response:", text);
//   } catch (error) {
//     console.error("❌ Error:", error);
//   }
// }

// test();
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();