package com.FDS.API.FoodDonation;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface FoodDonationRepository extends CrudRepository<FoodDonation, Long> {
    FoodDonation findByDonationID(Long donationID);
    List<FoodDonation> findByFoodBank_UserID(Long userID); // Find all donations by food bank's user ID
    List<FoodDonation> findByDonorUser_UserID(Long userID); // Find all donations by donor's user ID
}
