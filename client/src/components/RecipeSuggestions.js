import React, { useState } from 'react';
import axios from 'axios';

const RecipeSuggestions = () => {
  const [ingredients, setIngredients] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    try {
      // Correct way
const res = await axios.get(`http://localhost:5000/api/recipes/suggestions?ingredients=${ingredients}`);
      setSuggestions(res.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Smart Recipe Suggestions</h2>
      
      <input
        type="text"
        className="border p-2 w-full rounded mb-2"
        placeholder="Enter ingredients (e.g. penne,chicken,broccoli)"
        value={ingredients}
        onChange={e => setIngredients(e.target.value)}
      />
      
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={fetchSuggestions}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Get Suggestions'}
      </button>

      {suggestions.length > 0 ? (
        <div className="mt-6 space-y-4">
          {suggestions.map((recipe, index) => (
            <div key={index} className="border rounded p-4 shadow">
              <h3 className="text-lg font-bold">{recipe.name}</h3>
              <p className="text-sm text-gray-600">
                Match: {recipe.matchPercent}%
              </p>
              <ul className="list-disc list-inside mt-2">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step.instructions}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="mt-4 text-gray-500">No suggestions found.</p>
      )}
    </div>
  );
};

export default RecipeSuggestions;
