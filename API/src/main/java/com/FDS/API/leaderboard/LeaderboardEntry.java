package com.FDS.API.leaderboard;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import com.FDS.API.TestUser.TestUser;

import java.time.LocalDate;

@Entity
public class LeaderboardEntry {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private TestUser donor;
    
    private Double amount;
    private LocalDate donationDate;
    
    // Default constructor
    public LeaderboardEntry() {}
    
    // Constructor with fields
    public LeaderboardEntry(TestUser donor, Double amount, LocalDate donationDate) {
        this.donor = donor;
        this.amount = amount;
        this.donationDate = donationDate;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TestUser getDonor() {
        return donor;
    }

    public void setDonor(TestUser donor) {
        this.donor = donor;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDate donationDate) {
        this.donationDate = donationDate;
    }
}