package com.FDS.API.Home;

public class DonorHomeDTO {
    private String userName;
    private int totalDonations;
    private double totalWeight;
    
    // Default constructor
    public DonorHomeDTO() {
    }
    
    // Constructor with all fields
    public DonorHomeDTO(String userName, int totalDonations, double totalWeight) {
        this.userName = userName;
        this.totalDonations = totalDonations;
        this.totalWeight = totalWeight;
    }
    
    // Getters and setters
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public int getTotalDonations() {
        return totalDonations;
    }
    
    public void setTotalDonations(int totalDonations) {
        this.totalDonations = totalDonations;
    }
    
    public double getTotalWeight() {
        return totalWeight;
    }
    
    public void setTotalWeight(double totalWeight) {
        this.totalWeight = totalWeight;
    }
}