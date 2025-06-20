// components/IngredientForm.js
import React, { useState } from 'react';

function IngredientForm({ ingredients, setIngredients }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    if (name.trim() && quantity.trim()) {
      setIngredients([...ingredients, { name, quantity }]);
      setName('');
      setQuantity('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-700 mb-4">🧾 Add Your Ingredients</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingredient name"
          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        ➕ Add Ingredient
      </button>

      <ul className="mt-6">
        {ingredients.map((item, index) => (
          <li key={index} className="text-gray-700">
            ✅ {item.name} – {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientForm;
