const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  instructions: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      type: String,
    },
  ],
});

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  steps: [StepSchema],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
