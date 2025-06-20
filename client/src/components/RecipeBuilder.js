import React, { useState } from "react";

export default function RecipeBuilder({ ingredients = [] }) {
  const [steps, setSteps] = useState([
    { instructions: "", selectedIngredients: [], customIngredients: [] },
  ]);
  const [recipeName, setRecipeName] = useState("");
  const [customInput, setCustomInput] = useState([""]);
  const [saveStatus, setSaveStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  function handleInstructionsChange(stepIndex, value) {
    const newSteps = [...steps];
    newSteps[stepIndex].instructions = value;
    setSteps(newSteps);
  }

  function toggleIngredient(stepIndex, ingredientName) {
    const newSteps = [...steps];
    const selected = newSteps[stepIndex].selectedIngredients || [];

    if (selected.includes(ingredientName)) {
      newSteps[stepIndex].selectedIngredients = selected.filter(
        (ing) => ing !== ingredientName
      );
    } else {
      newSteps[stepIndex].selectedIngredients = [...selected, ingredientName];
    }

    setSteps(newSteps);
  }

  function addCustomIngredient(stepIndex) {
    const newSteps = [...steps];
    const newCustomInput = [...customInput];
    const trimmedInput = newCustomInput[stepIndex].trim();

    if (trimmedInput === "") return;

    const selected = newSteps[stepIndex].selectedIngredients || [];
    const custom = newSteps[stepIndex].customIngredients || [];

    if (!custom.includes(trimmedInput) && !selected.includes(trimmedInput)) {
      newSteps[stepIndex].customIngredients = [...custom, trimmedInput];
    }

    newCustomInput[stepIndex] = "";
    setSteps(newSteps);
    setCustomInput(newCustomInput);
  }

  function handleCustomInputChange(stepIndex, value) {
    const newCustomInput = [...customInput];
    newCustomInput[stepIndex] = value;
    setCustomInput(newCustomInput);
  }

  function handleCustomInputKeyDown(e, stepIndex) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomIngredient(stepIndex);
    }
  }

  function addStep() {
    setSteps([
      ...steps,
      { instructions: "", selectedIngredients: [], customIngredients: [] },
    ]);
    setCustomInput([...customInput, ""]);
  }

  function handleSave() {
    // Save the generated recipe if it exists, otherwise save manual steps
    const recipeToSave = generatedRecipe || { name: recipeName, steps };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipeToSave),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Recipe saved:", data);
        setSaveStatus("✅ Recipe saved successfully!");
      })
      .catch((err) => {
        console.error("Error saving recipe:", err);
        setSaveStatus("❌ Error saving recipe. Try again.");
      });
  }

  async function handleGenerateSteps() {
    // Build an array of ingredient names from multiple sources
    const propsIngredients = ingredients.map((ing) => ing.name);
    const customIngredientsFromSteps = steps.flatMap(step => step.customIngredients || []);
    const currentCustomInputs = customInput.filter((val) => val.trim() !== "");
    
    const allIngredients = [
      ...propsIngredients,
      ...customIngredientsFromSteps,
      ...currentCustomInputs
    ];

    // Remove duplicates
    const uniqueIngredients = [...new Set(allIngredients)];

    console.log("Sending to backend:", uniqueIngredients);

    if (uniqueIngredients.length === 0) return;

    try {
      setIsGenerating(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/generate-steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: uniqueIngredients,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      if (data.steps && Array.isArray(data.steps)) {
        // Create the generated recipe object
        const recipe = {
          name: recipeName || "Generated Recipe",
          steps: data.steps.map((instruction, index) => ({
            stepNumber: index + 1,
            instructions: instruction,
            ingredients: uniqueIngredients // All ingredients available for each step
          }))
        };
        
        setGeneratedRecipe(recipe);
        setSaveStatus("✅ Recipe generated successfully!");
      } else {
        throw new Error("Invalid response from backend");
      }
    } catch (err) {
      console.error("Failed to generate steps:", err);
      setSaveStatus("❌ Failed to generate steps: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  // Show generated recipe preview if available
  const preview = generatedRecipe ? (
    <div className="mt-6 p-4 border rounded bg-green-50">
      <h2 className="text-xl font-semibold mb-2">Generated Recipe</h2>
      <p className="mb-4">
        <strong>Name:</strong> {generatedRecipe.name}
      </p>
      <p className="mb-2">
        <strong>Ingredients:</strong> {ingredients.map(ing => ing.name).join(", ")}
      </p>
      {generatedRecipe.steps.map((step, i) => (
        <div key={i} className="mb-3">
          <p>
            <strong>Step {step.stepNumber}:</strong> {step.instructions}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">Recipe Preview</h2>
      <p>
        <strong>Name:</strong> {recipeName || "(no name yet)"}
      </p>
      {steps.map((step, i) => {
        const selected = step.selectedIngredients || [];
        const custom = step.customIngredients || [];
        const allStepIngredients = [...selected, ...custom];
        return (
          <div key={i} className="mb-3">
            <p>
              <strong>Step {i + 1}:</strong>{" "}
              {step.instructions || "(no instructions)"}
            </p>
            <p>
              <strong>Ingredients:</strong>{" "}
              {allStepIngredients.length > 0 ? allStepIngredients.join(", ") : "None"}
            </p>
          </div>
        );
      })}
    </div>
  );

  const canGenerate =
    ingredients.length > 0 || 
    customInput.some((val) => val.trim() !== "") ||
    steps.some(step => (step.customIngredients || []).length > 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🍳 Build Your Own Recipe</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="recipeName">
          Recipe Name
        </label>
        <input
          id="recipeName"
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter recipe name"
        />
      </div>

      <button
        onClick={handleGenerateSteps}
        disabled={!canGenerate || isGenerating}
        title={
          !canGenerate
            ? "Please add some ingredients first"
            : "Generate complete recipe with steps"
        }
        className={`mb-6 px-4 py-2 rounded text-white transition ${
          !canGenerate || isGenerating
            ? "bg-purple-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {isGenerating ? "Generating..." : "⚡ Generate Complete Recipe"}
      </button>

      {/* Only show manual step builder if no recipe has been generated */}
      {!generatedRecipe && (
        <>
          {steps.map((step, index) => (
            <div key={index} className="mb-6 border p-4 rounded shadow-sm">
              <h3 className="font-semibold mb-2">Step {index + 1}</h3>

              <textarea
                placeholder="Describe the step..."
                value={step.instructions}
                onChange={(e) => handleInstructionsChange(index, e.target.value)}
                className="w-full p-2 border rounded mb-3"
                rows={3}
              />

              <div>
                <p className="font-semibold mb-1">Select ingredients:</p>
                <div className="flex flex-wrap gap-3 mb-2">
                  {(ingredients || []).map((ing) => (
                    <label
                      key={ing._id || ing.name}
                      className="inline-flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(step.selectedIngredients || []).includes(ing.name)}
                        onChange={() => toggleIngredient(index, ing.name)}
                        className="form-checkbox"
                      />
                      <span>{ing.name}</span>
                    </label>
                  ))}
                </div>

                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    placeholder="Add custom ingredient (e.g. salt, spices)"
                    value={customInput[index]}
                    onChange={(e) =>
                      handleCustomInputChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleCustomInputKeyDown(e, index)}
                    className="flex-grow p-2 border rounded"
                  />
                  <button
                    onClick={() => addCustomIngredient(index)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addStep}
            className="mb-6 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            ➕ Add Another Step
          </button>
        </>
      )}

      {/* Reset button if recipe was generated */}
      {generatedRecipe && (
        <button
          onClick={() => {
            setGeneratedRecipe(null);
            setSteps([{ instructions: "", selectedIngredients: [], customIngredients: [] }]);
            setCustomInput([""]);
            setSaveStatus("");
          }}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          🔄 Start Over / Build Manually
        </button>
      )}

      {preview}

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Recipe
      </button>

      {saveStatus && <p className="mt-2 text-green-600">{saveStatus}</p>}
    </div>
  );
}