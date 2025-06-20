const express = require('express');
const Ingredient = require('../models/Ingredient');

const router = express.Router();

// POST route to add ingredients
router.post('/add', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const newIngredient = new Ingredient({ name, quantity });
    await newIngredient.save();
    res.status(201).json({ message: 'Ingredient added!', data: newIngredient });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add ingredient', error });
  }
});

// GET route to view all ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ dateAdded: -1 });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ingredients', error });
  }
});

module.exports = router;
