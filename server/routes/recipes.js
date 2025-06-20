const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();

// POST /api/recipes
router.post('/', async (req, res) => {
  try {
    const { name, steps } = req.body;

    if (!name || !steps || !steps.length) {
      return res.status(400).json({ error: 'Recipe name and steps are required.' });
    }

    const newRecipe = new Recipe({ name, steps });
    await newRecipe.save();

    res.status(201).json({ message: 'Recipe saved!', recipe: newRecipe });
  } catch (err) {
    console.error('Error saving recipe:', err);
    res.status(500).json({ error: 'Server error saving recipe.', details: err.message });
  }
});

// GET /api/recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Server error fetching recipes." });
  }
});

// GET /api/recipes/suggestions?ingredients=penne,chicken,broccoli
router.get('/suggestions', async (req, res) => {
  const queryIngredients = req.query.ingredients;

  if (!queryIngredients) {
    return res.status(400).json({ error: 'No ingredients provided' });
  }

  const ingredientArray = queryIngredients
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => i);

  try {
    const recipes = await Recipe.find();

    const suggestions = recipes.map(recipe => {
      const allIngredients = recipe.steps.flatMap(step => {
        const ids = (step.ingredients || []).map(i => (typeof i === 'string' ? i : String(i)).toLowerCase());
        const customs = (step.customIngredients || []).map(i => i.toLowerCase());
        return [...ids, ...customs];
      });

      const matchedIngredients = ingredientArray.filter(i => allIngredients.includes(i));
      const matchPercent = Math.round((matchedIngredients.length / ingredientArray.length) * 100);

      return {
        name: recipe.name,
        steps: recipe.steps,
        matchedIngredients,
        matchPercent
      };
    }).filter(s => s.matchedIngredients.length > 0);

    suggestions.sort((a, b) => b.matchPercent - a.matchPercent);

    res.status(200).json(suggestions);
  } catch (err) {
    console.error("Error suggesting recipes:", err);
    res.status(500).json({ error: "Server error suggesting recipes." });
  }
});

module.exports = router;
