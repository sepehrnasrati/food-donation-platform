package com.FDS.API.FoodDonation;

import java.util.List;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;
import com.FDS.API.leaderboard.LeaderboardEntry;
import com.FDS.API.leaderboard.LeaderboardRepository;
import com.FDS.API.leaderboard.LeaderboardSSEController;
import com.FDS.API.leaderboard.LeaderboardUpdateDTO;

import java.time.LocalDate;
import java.util.List;

@RestController
public class FoodDonationController {
    @Autowired
    private FoodDonationRepository foodDonationRepository;

    @Autowired
    private TestUserRepository userRepo;


    @Autowired
    private JavaMailSender javaMailSender;
    
    @Autowired
    private LeaderboardRepository leaderboardRepository;
    
    @Autowired
    private TestUserRepository userRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private LeaderboardSSEController sseController;

    // Create a new food donation
    @PostMapping("/donations")@Transactional
    public ResponseEntity<FoodDonation> createFoodDonation(
            @RequestBody FoodDonationDTO foodDonationDTO) {
        
        // Fetch the TestUser objects using the IDs from DTO
        Optional<TestUser> foodBankOpt = userRepo.findById(foodDonationDTO.getFoodBank());
        if (foodBankOpt.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Return 400 if food bank is not found
        }

        Optional<TestUser> donorUserOpt = userRepo.findById(foodDonationDTO.getDonorUser());
        if (donorUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        FoodDonation donation = new FoodDonation(
            foodDonationDTO.getName(), 
            foodDonationDTO.getAmount(),
            foodDonationDTO.getExpirationDate(), 
            foodDonationDTO.getImage(), 
            foodDonationDTO.getStatus(),
            foodBankOpt.get(), 
            donorUserOpt.get()
        );
        
        foodDonationRepository.save(donation);

        // Update leaderboard
        TestUser donor = donorUserOpt.get();
        try {
            LeaderboardEntry entry = new LeaderboardEntry(
                donor,
                donation.getAmount(),
                LocalDate.now()
            );
            leaderboardRepository.save(entry);
            
            LeaderboardUpdateDTO updateDTO = new LeaderboardUpdateDTO(
                donor.getUserID(),
                donor.getName(),
                1L,
                donation.getAmount(),
                "all"
            );
            
            try {
                messagingTemplate.convertAndSend("/topic/leaderboard", updateDTO);
            } catch (Exception e) {
                System.err.println("Error sending WebSocket notification: " + e.getMessage());
            }
            
            try {
                sseController.broadcastLeaderboardUpdate(updateDTO);
            } catch (Exception e) {
                System.err.println("Error sending SSE notification: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error updating leaderboard: " + e.getMessage());
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("2139306@brunel.ac.uk");
            message.setFrom("Food Donation App <malisha77p@gmail.com>");
            message.setSubject("New Donation Received");
            message.setText("A new donation has been received. " + donation.getAmount() + "g worth of "
                    + donation.getName() + " will expire on " + donation.getExpirationDate()
                    + ". Please check the website for more details.");
            javaMailSender.send(message);
        } catch (MailException e) {
            System.err.println("Error sending email: " + e.getMessage());
        }

        return ResponseEntity.ok(donation);
    }

    // Update a food donation
    @PutMapping("/donations/{id}")
    public ResponseEntity<FoodDonation> updateFoodDonation(
        @PathVariable Long id,
        @RequestBody FoodDonationDTO foodDonationDTO
    ) {
        // Find the donation by ID
        FoodDonation donation = foodDonationRepository.findByDonationID(id);
        if (donation == null) {
            return ResponseEntity.notFound().build(); // Return 404 if donation is not found
        }

        // Fetch the TestUser object using the foodBankID
        Optional<TestUser> foodBankOpt = userRepo.findById(foodDonationDTO.getFoodBank());
        if (foodBankOpt.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Return 400 if food bank is not found
        }

        // Update the donation fields
        donation.setName(foodDonationDTO.getName());
        donation.setAmount(foodDonationDTO.getAmount());
        donation.setExpirationDate(foodDonationDTO.getExpirationDate());
        donation.setImage(foodDonationDTO.getImage());
        donation.setFoodBank(foodBankOpt.get()); // Set the TestUser object

        // Save the updated donation
        foodDonationRepository.save(donation);

        return ResponseEntity.ok(donation);
    }

    @GetMapping("/donations/foodBank/{id}")
    public ResponseEntity<List<FoodDonation>> getFoodDonationByFoodBankId(@PathVariable Long id) {
        List<FoodDonation> donations = foodDonationRepository.findByFoodBank_UserID(id);
        if (donations.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());  //Return empty list with 200 OK
        }
        return ResponseEntity.ok(donations);
    }


    @PutMapping("/donations/{id}/status")
    public ResponseEntity<FoodDonation> updateDonationStatus(
        @PathVariable Long id,
        @RequestParam String status // New status: "accepted" or "declined"
    ) {
        Optional<FoodDonation> donationOpt = foodDonationRepository.findById(id);
        if (donationOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
    
        FoodDonation donation = donationOpt.get();
        donation.setStatus(status); // Update the status
        foodDonationRepository.save(donation); // Save the updated donation
    
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/donations/donor/{id}")
    public ResponseEntity<List<FoodDonation>> getFoodDonationByDonorId(@PathVariable Long id) {
        List<FoodDonation> donations = foodDonationRepository.findByDonorUser_UserID(id);
        if (donations.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());  // Return empty list with 200 OK
        }
        return ResponseEntity.ok(donations);
    }
}
