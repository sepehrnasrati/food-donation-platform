package com.FDS.API.ExpiryDate;

import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
public class ExpiryDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodItem;
    private LocalDate expiryDate;

    // Constructors
    public ExpiryDate() {}

    public ExpiryDate(String foodItem, LocalDate expiryDate) {
        this.foodItem = foodItem;
        this.expiryDate = expiryDate;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public String getFoodItem() { return foodItem; }
    public void setFoodItem(String foodItem) { this.foodItem = foodItem; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
    