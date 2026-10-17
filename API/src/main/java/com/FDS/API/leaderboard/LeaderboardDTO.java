package com.FDS.API.leaderboard;

public class LeaderboardDTO {
    private Long id;
    private String donorName;
    private Long donations;
    private Double amount;
    
    // Default constructor
    public LeaderboardDTO() {}
    
    // Constructor with fields
    public LeaderboardDTO(Long id, String donorName, Long donations, Double amount) {
        this.id = id;
        this.donorName = donorName;
        this.donations = donations;
        this.amount = amount;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public Long getDonations() {
        return donations;
    }

    public void setDonations(Long donations) {
        this.donations = donations;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}