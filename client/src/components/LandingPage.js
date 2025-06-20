import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-green-50 to-green-100 flex justify-center items-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-12 text-center">
        <h1 className="text-7xl font-extrabold text-green-800 mb-8 select-none">🥗 FridgeCraft</h1>
        <p className="text-green-700 text-xl mb-12 leading-relaxed">
          Welcome to FridgeCraft! Build delicious recipes with the ingredients you have.
        </p>

        <div className="flex justify-center space-x-8">
          <Link
            to="/ingredients"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-2xl transition"
          >
            Ingredients
          </Link>
          <Link
            to="/build-recipe"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-2xl transition"
          >
            Build Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
