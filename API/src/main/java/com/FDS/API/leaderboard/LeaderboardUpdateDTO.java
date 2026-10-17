package com.FDS.API.leaderboard;

public class LeaderboardUpdateDTO {
    private Long donorId;
    private String donorName;
    private Long donations; // Number of donations
    private Double amount;
    private String period; // "week", "month", or "year" or "all"

    // Constructors
    public LeaderboardUpdateDTO() {
    }

    public LeaderboardUpdateDTO(Long donorId, String donorName, Long donations, Double amount, String period) {
        this.donorId = donorId;
        this.donorName = donorName;
        this.donations = donations;
        this.amount = amount;
        this.period = period;
    }

    // Getters and setters
    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
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

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}