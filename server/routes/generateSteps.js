const express = require('express');
const { generateRecipeSteps } = require('../utils/generateSteps');

const generateStepsRoute = express.Router();

generateStepsRoute.post('/', async (req, res) => {
  const { ingredients } = req.body;

  // 🛡️ Validate input
  if (!Array.isArray(ingredients)) {
    console.error("❌ Invalid ingredients format:", ingredients);
    return res.status(400).json({ error: "'ingredients' must be an array of strings" });
  }

  try {
    console.log("✅ Ingredients received:", ingredients);

    // Generate steps from Gemini
    const steps = await generateRecipeSteps(ingredients.join(", "));

    res.json({ steps });
  } catch (err) {
    console.error('❌ Gemini error:', err);
    res.status(500).json({ error: 'Failed to generate recipe steps' });
  }
});

module.exports = generateStepsRoute;
