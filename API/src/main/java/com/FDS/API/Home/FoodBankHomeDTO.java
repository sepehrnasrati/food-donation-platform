// 1. DTO for FoodBank Home Page
package com.FDS.API.Home;

public class FoodBankHomeDTO {
    private String foodBankName;
    private int totalDonationsReceived;
    private double totalWeightReceived;
    private int pendingDonations;
    private int donorsThisMonth;
    
    // Default constructor
    public FoodBankHomeDTO() {
    }
    
    // Constructor with all fields
    public FoodBankHomeDTO(String foodBankName, int totalDonationsReceived, 
                          double totalWeightReceived, int pendingDonations,
                          int donorsThisMonth) {
        this.foodBankName = foodBankName;
        this.totalDonationsReceived = totalDonationsReceived;
        this.totalWeightReceived = totalWeightReceived;
        this.pendingDonations = pendingDonations;
        this.donorsThisMonth = donorsThisMonth;
    }
    
    // Getters and setters
    public String getFoodBankName() {
        return foodBankName;
    }
    
    public void setFoodBankName(String foodBankName) {
        this.foodBankName = foodBankName;
    }
    
    public int getTotalDonationsReceived() {
        return totalDonationsReceived;
    }
    
    public void setTotalDonationsReceived(int totalDonationsReceived) {
        this.totalDonationsReceived = totalDonationsReceived;
    }
    
    public double getTotalWeightReceived() {
        return totalWeightReceived;
    }
    
    public void setTotalWeightReceived(double totalWeightReceived) {
        this.totalWeightReceived = totalWeightReceived;
    }
    
    public int getPendingDonations() {
        return pendingDonations;
    }
    
    public void setPendingDonations(int pendingDonations) {
        this.pendingDonations = pendingDonations;
    }
    
    public int getDonorsThisMonth() {
        return donorsThisMonth;
    }
    
    public void setDonorsThisMonth(int donorsThisMonth) {
        this.donorsThisMonth = donorsThisMonth;
    }
}