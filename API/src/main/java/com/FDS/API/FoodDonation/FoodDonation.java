package com.FDS.API.FoodDonation;

import com.FDS.API.TestUser.TestUser;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "FoodDonations")
public class FoodDonation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donation_id")
    private Long donationID;

    @NotBlank
    private String name;

    private Double amount;

    @NotBlank
    private String expirationDate;

    @NotBlank
    private String image;
    
    @ManyToOne
    @JoinColumn(name = "donor_id")
    private TestUser donor;

    @NotBlank
    private String status;

    // Many-to-One relationship with TestUser (Food Bank)
    @ManyToOne
    @JoinColumn(name = "food_bank_id", nullable = false) // Foreign key column in FoodDonations table
    private TestUser foodBank;

    @ManyToOne
    @JoinColumn(name = "donor_user_id", nullable = false) // Foreign key column in FoodDonations table
    private TestUser donorUser;

    // Constructors, getters, and setters
    public FoodDonation() {
        super();
    }

    public FoodDonation(String name, Double amount, String expirationDate, String image, String status, TestUser foodBank, TestUser donorUser) {
        this.name = name;
        this.amount = amount;
        this.expirationDate = expirationDate;
        this.image = image;
        this.status = status;
        this.foodBank = foodBank;
        this.donorUser = donorUser;
    }

    // Getters and setters for all fields
    public Long getDonationID() {
        return donationID;
    }

    public void setDonationID(Long donationID) {
        this.donationID = donationID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public TestUser getFoodBank() {
        return foodBank;
    }

    public void setFoodBank(TestUser foodBank) {
        this.foodBank = foodBank;
    }

    public TestUser getDonorUser() {
        return donorUser;
    }

    public void setDonorUser(TestUser donorUser) {
        this.donorUser = donorUser;
    }
}