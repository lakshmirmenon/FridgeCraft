const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String, // e.g., "2 cups", "1 tsp"
    required: false
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;
