package com.FDS.API.TestUser;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.communityforum.ValidationService;

@RestController
public class TestUserController {
    @Autowired
    private TestUserRepository userRepo;

    @Autowired
    private ValidationService validationService;

    // Get a list of all users
    @GetMapping("/users")
    public ResponseEntity<List<TestUser>> getAllTestUsers() {
        List<TestUser> users = (List<TestUser>) userRepo.findAll();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    // Get a specific user by their ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        ResponseEntity<Map<String, String>> userCheckResponse = validationService.checkIfUserExists(id);
        if (userCheckResponse != null) {
            return userCheckResponse; // User not found, return error
        }
        TestUser user = userRepo.findById(id).get();
        
        TestUserDTO userDTO = new TestUserDTO(user.getUserID(), user.getAccountType(), user.getName(), user.getEmail(), user.getProfilePic(), user.getAbout(), user.getCreatedAt());
        
        // return DTO
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }

    @GetMapping("/foodbanks")
    public ResponseEntity<List<FoodBankDTO>> getAllFoodBanks() {
        try {
            List<TestUser> foodBanks = userRepo.findAllFoodBanks();
            List<FoodBankDTO> foodBankDTOs = foodBanks.stream()
                    .map(user -> new FoodBankDTO(user))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(foodBankDTOs);
        } catch (Exception e) {
            // Add logging here to help debug the 500 error
            System.out.println("Error fetching food banks: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/users/foodbanks")
    public ResponseEntity<List<TestUser>> getFoodBanks() {
        List<TestUser> foodBanks = userRepo.findByAccountType(AccountType.FOOD_BANK);
        return ResponseEntity.ok(foodBanks);
    }
}