import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import IngredientForm from './components/IngredientForm';
import RecipeBuilder from './components/RecipeBuilder';
import RecipeSuggestions from './components/RecipeSuggestions';

function Navbar() {
  const location = useLocation();
  const onLandingPage = location.pathname === '/';

  return (
    <nav className="w-full bg-green-900 shadow-md p-4 flex justify-between items-center px-8">
      <Link
        to="/"
        className="text-white text-3xl font-extrabold tracking-wider select-none hover:underline"
      >
        🥗 FridgeCraft
      </Link>

      {!onLandingPage && (
        <div className="space-x-8">
          <Link
            to="/ingredients"
            className="text-white text-xl font-semibold hover:underline hover:text-green-300"
          >
            Ingredients
          </Link>
          <Link
            to="/build-recipe"
            className="text-white text-xl font-semibold hover:underline hover:text-green-300"
          >
            Build Recipe
          </Link>
          <Link
            to="/suggestions"
            className="text-white text-xl font-semibold hover:underline hover:text-green-300"
          >
            Suggestions
          </Link>
        </div>
      )}
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const onLandingPage = location.pathname === '/';

  const [ingredients, setIngredients] = useState([]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-green-50 to-green-100 flex flex-col">
      <Navbar />

      <main className="flex-grow flex justify-center items-center px-4 py-8">
        {onLandingPage ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        ) : (
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10">
            <Routes>
              <Route
                path="/ingredients"
                element={
                  <IngredientForm
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                  />
                }
              />
              <Route
                path="/build-recipe"
                element={
                  <RecipeBuilder ingredients={ingredients} />
                }
              />
              <Route
                path="/suggestions"
                element={
                  <RecipeSuggestions ingredients={ingredients} />
                }
              />
            </Routes>
          </div>
        )}
      </main>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
