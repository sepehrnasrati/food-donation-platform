import { useEffect, useState } from "react";
import { Input } from "../../../Components/ui/input";
import { Button } from "../../../Components/ui/button";
import { Heart, Search, X } from "lucide-react";
import { Card, CardContent } from "../../../Components/ui/card";
import { toast } from "sonner";
import { Toaster } from "../../../Components/ui/sonner";
import axios from "axios";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../Components/ui/alert";
function GenerateRecipes({ token, currentUserID }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    console.log("fetching favorites");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/${currentUserID}/favorites`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      const data = await response.data;
      setFavorites(data);
    } catch (err) {
      console.log("fetchfavourites error:", err);
      console.error("Error fetching favorites:", err);
    }
  };

  const searchRecipes = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchTerm.trim()}`
      );
      const data = await response.json();
      setRecipes(data.meals || []);
      if (recipes.length === 0) setError("No recipes found.");
    } catch (err) {
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setSelectedRecipe(data.meals[0]);
    } catch (err) {
      setError("Failed to fetch recipe details. Please try again.");
    }
  };

  const addToFavorites = async (recipe) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/${currentUserID}/favorites`,
        {
          recipeId: recipe.idMeal,
          recipeName: recipe.strMeal,
          recipeImage: recipe.strMealThumb,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: { currentUserID: currentUserID },
        }
      );

      if (response.ok) {
        toast("Success!", {
          description: `${recipe.strMeal} added to favorites`,
        });
        await fetchFavorites();
      } else {
        throw new Error("Failed to add to favorites");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromFavorites = async (recipeId) => {
    try {
      axios.delete(
        `http://localhost:8080/api/users/${currentUserID}/favorites/${recipeId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast("Success!", {
          description: `Recipe removed from favorites`,
        });
        await fetchFavorites();
      } else {
        throw new Error("Failed to remove from favorites");
      }
    } catch (err) {
      toast.error("Failed to remove from favorites");
    }
    await fetchFavorites();
  };

  const toggleFavorite = (recipe) => {
    const isFavorite = favorites.some((fav) => fav.recipeId === recipe.idMeal);
    if (isFavorite) {
      removeFromFavorites(recipe.idMeal);
    } else {
      addToFavorites(recipe);
    }
  };
  const isRecipeFavorited = (recipeId) => {
    return favorites.some((fav) => fav.recipeId === recipeId);
  };
  const handleShowFavorites = async () => {
    await fetchFavorites();
    setShowFavorites(true);
    setRecipes(
      favorites.map((fav) => ({
        idMeal: fav.recipeId,
        strMeal: fav.recipeName,
        strMealThumb: fav.recipeImage,
      }))
    );
  };

  return (
    <>
      <main className="px-4">
        <div className="mb-6 mt-5">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter an ingredient (e.g., chicken breast)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-[#2d314c]"
              onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
            />
            <Button
              onClick={searchRecipes}
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button
              onClick={handleShowFavorites}
              className={showFavorites ? "gap-0 hover:bg-[#5e65ce]" : ""}
            >
              <Heart
                className="w-4 h-4 mr-2"
                fill={showFavorites ? "currentColor" : "none"}
              />
              Show Favourites
            </Button>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mt-4"
            >
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {recipes?.map((recipe) => (
              <Card
                key={recipe.idMeal}
                className="cursor-pointer hover:shadow-lg transition-shadow bg-[#2d314c] text-white border-0"
                onClick={() => fetchRecipeDetails(recipe.idMeal)}
              >
                <CardContent className="p-4 bg-[#2d314c] text-white">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-lg">{recipe.strMeal}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ">
            <div className="rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative bg-[#2d314c] text-white">
              <Button
                className="absolute left-2 top-2 z-10 bg-white bg-opacity-100 rounded-full p-2 hover:bg-opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(selectedRecipe);
                }}
              >
                <Heart />
              </Button>
              <Button
                variant="ghost"
                className="absolute right-4 top-4 bg-black h-8 w-1"
                onClick={() => setSelectedRecipe(null)}
              >
                <X className="w-4 h-4 my-40" />
              </Button>

              <img
                src={selectedRecipe.strMealThumb}
                alt={selectedRecipe.strMeal}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <h2 className="text-2xl font-bold mb-4">
                {selectedRecipe.strMeal}
              </h2>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Ingredients:</h3>
                <ul className="list-disc pl-6">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const ingredient = selectedRecipe[`strIngredient${i + 1}`];
                    const measure = selectedRecipe[`strMeasure${i + 1}`];
                    if (ingredient && ingredient.trim()) {
                      return (
                        <li key={i}>
                          {measure} {ingredient}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
                <p className="whitespace-pre-line">
                  {selectedRecipe.strInstructions}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Toaster />
    </>
  );
}

export default GenerateRecipes;
