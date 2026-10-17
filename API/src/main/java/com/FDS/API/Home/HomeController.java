package com.FDS.API.Home;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;
import com.FDS.API.FoodDonation.FoodDonation;
import com.FDS.API.FoodDonation.FoodDonationRepository;

import java.util.List;

@RestController
public class HomeController {
    
    @Autowired
    private TestUserRepository userRepository;
    
    @Autowired
    private FoodDonationRepository donationRepository;
    
    @GetMapping("/home/donor/{userId}")
    public ResponseEntity<?> getDonorHomeData(@PathVariable Long userId) {
        // Find the user in the database
        TestUser user = userRepository.findById(userId).orElse(null);
        
        // If user not found, return 404 Not Found
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Get all donations made by this user
        List<FoodDonation> userDonations = donationRepository.findByDonorUser_UserID(userId);
        
        // Calculate total donations and weight
        int totalDonations = userDonations.size();
        double totalWeight = userDonations.stream()
                .mapToDouble(FoodDonation::getAmount)
                .sum();
        
        // Create a DTO with all the information
        DonorHomeDTO homeData = new DonorHomeDTO(
            user.getName(),
            totalDonations,
            totalWeight
        );
        
        return ResponseEntity.ok(homeData);
    }
}