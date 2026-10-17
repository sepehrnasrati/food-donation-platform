package com.FDS.API.FoodDonation;

import com.FDS.API.TestUser.TestUser;

public class FoodDonationDTO {

    private Long donationID;
    private String name;
    private Double amount;
    private String expirationDate;
    private String image;
    private String status;
    private Long foodBank;
    private Long donorUser;
    

    public FoodDonationDTO(Long donationID, String name, Double amount, String expirationDate, String image, String status, Long foodBank, Long donorUser) {
        this.donationID = donationID;
        this.name = name;
        this.amount = amount;
        this.expirationDate = expirationDate;
        this.image = image;
        this.status = status;
        this.foodBank = foodBank;
        this.donorUser = donorUser;
    }

    // getters setters
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

    public Long getFoodBank() {
        return foodBank;
    }

    public void setFoodBank(Long foodBank) {
        this.foodBank = foodBank;
    }

    public Long getDonorUser() {
        return donorUser;
    }

    public void setDonorUser(Long donorUser) {
        this.donorUser = donorUser;
    }
}
