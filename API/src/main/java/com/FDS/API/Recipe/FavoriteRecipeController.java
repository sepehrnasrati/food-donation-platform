package com.FDS.API.Recipe;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class FavoriteRecipeController {

    @Autowired
    private FavoriteRecipeRepository favoriteRecipeRepository;

    // Get all favorites for a user
    @GetMapping("/users/{userId}/favorites")
    public ResponseEntity<List<FavoriteRecipe>> getUserFavorites(@PathVariable Long userId) {
        List<FavoriteRecipe> favorites = favoriteRecipeRepository.findByUserId(userId);
        return ResponseEntity.ok(favorites);
    }

    // Add a recipe to favorites
    @PostMapping("/users/{userId}/favorites")
    public ResponseEntity<?> addToFavorites(
            @PathVariable Long userId,
            @RequestBody FavoriteRecipeRequest request) {
        
        // Check if already favorited
        Optional<FavoriteRecipe> existingFavorite = 
                favoriteRecipeRepository.findByUserIdAndRecipeId(userId, request.getRecipeId());
        
        if (existingFavorite.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Recipe already in favorites");
        }
        
        FavoriteRecipe favoriteRecipe = new FavoriteRecipe();
        favoriteRecipe.setUserId(userId);
        favoriteRecipe.setRecipeId(request.getRecipeId());
        favoriteRecipe.setRecipeName(request.getRecipeName());
        favoriteRecipe.setRecipeImage(request.getRecipeImage());
        
        FavoriteRecipe saved = favoriteRecipeRepository.save(favoriteRecipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    // Remove a recipe from favorites
    @DeleteMapping("/users/{userId}/favorites/{recipeId}")
    public ResponseEntity<?> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable String recipeId) {
        
        Optional<FavoriteRecipe> existingFavorite = 
                favoriteRecipeRepository.findByUserIdAndRecipeId(userId, recipeId);
        
        if (existingFavorite.isPresent()) {
            favoriteRecipeRepository.delete(existingFavorite.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Recipe not found in favorites");
        }
    }
}