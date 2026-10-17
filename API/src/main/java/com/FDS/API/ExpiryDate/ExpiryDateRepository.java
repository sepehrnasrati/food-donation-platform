package com.FDS.API.ExpiryDate;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpiryDateRepository extends JpaRepository<ExpiryDate, Long> {
    List<ExpiryDate> findByFoodItemContainingIgnoreCase(String foodItem);
}