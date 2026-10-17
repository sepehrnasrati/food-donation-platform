package com.FDS.API.Recipe;

// 2. Repository Interface

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRecipeRepository extends JpaRepository<FavoriteRecipe, Long> {
    List<FavoriteRecipe> findByUserId(Long userId);
    Optional<FavoriteRecipe> findByUserIdAndRecipeId(Long userId, String recipeId);
    void deleteByUserIdAndRecipeId(Long userId, String recipeId);
}