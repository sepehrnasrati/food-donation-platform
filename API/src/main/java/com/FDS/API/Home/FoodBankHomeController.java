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

import java.util.ArrayList;
import java.util.Comparator;
// Removed unused Calendar and Date imports
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class FoodBankHomeController {

    @Autowired
    private TestUserRepository userRepository;

    @Autowired
    private FoodDonationRepository donationRepository;

    @GetMapping("/home/foodbank/{userId}")
    public ResponseEntity<?> getFoodBankHomeData(@PathVariable Long userId) {
        // Find the food bank user in the database
        TestUser foodBank = userRepository.findById(userId).orElse(null);

        // If food bank not found, return 404 Not Found
        if (foodBank == null) {
            return ResponseEntity.notFound().build();
        }

        // Get donations SPECIFICALLY for this food bank
        List<FoodDonation> foodBankDonations = donationRepository.findByFoodBank_UserID(userId); // <-- FIX 1: Fetch donations for this user

        // Calculate total donations for this food bank
        int totalDonations = foodBankDonations.size(); // <-- FIX 2: Use filtered list

        // Calculate total weight for this food bank
        double totalWeight = foodBankDonations.stream() // <-- FIX 2: Use filtered list
                .mapToDouble(FoodDonation::getAmount)
                .sum();

        // Calculate pending donations using the 'status' field
        int pendingDonations = (int) foodBankDonations.stream() // <-- FIX 2: Use filtered list
                .filter(d -> "pending".equalsIgnoreCase(d.getStatus())) // <-- FIX 3: Filter by status field
                .count();

        // Calculate unique donors this month FOR THIS FOOD BANK
        Set<Long> uniqueDonors = new HashSet<>();
        // In a real app, you might want to filter by donation date here as well
        for (FoodDonation donation : foodBankDonations) { // <-- FIX 2: Use filtered list
            if (donation.getDonorUser() != null) { // Use getDonorUser() which seems intended for the donor
                uniqueDonors.add(donation.getDonorUser().getUserID());
            }
        }

        // Create a DTO with all the information
        FoodBankHomeDTO homeData = new FoodBankHomeDTO(
            foodBank.getName(),
            totalDonations,
            totalWeight,
            pendingDonations,
            uniqueDonors.size()
        );

        return ResponseEntity.ok(homeData);
    }

    @GetMapping("/home/foodbank/{userId}/recent-donations")
    public ResponseEntity<?> getRecentDonations(@PathVariable Long userId) {
        TestUser foodBank = userRepository.findById(userId).orElse(null);
        if (foodBank == null) {
            return ResponseEntity.notFound().build();
        }

        // Fetch donations SPECIFICALLY for this food bank
        List<FoodDonation> foodBankDonations = donationRepository.findByFoodBank_UserID(userId); // <-- FIX: Fetch only relevant donations

        // Sort donations by most recent first (assuming expirationDate is a proxy, ideally use a real creation/donation date)
        // Note: Sorting String dates like this isn't ideal, but fixing the main 500 error first.
        foodBankDonations.sort(Comparator.comparing(FoodDonation::getExpirationDate, Comparator.nullsLast(Comparator.reverseOrder())));

        List<FoodDonation> recentDonations = foodBankDonations.stream()
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> donationDetails = new ArrayList<>();
        for (FoodDonation donation : recentDonations) {
            Map<String, Object> details = new HashMap<>();
            details.put("id", donation.getDonationID());
            // Use getDonorUser() for the actual donor information
            details.put("donor", donation.getDonorUser() != null ? donation.getDonorUser().getName() : "Anonymous");
            details.put("items", donation.getName());
            details.put("date", donation.getExpirationDate()); // Still using expirationDate as proxy
            details.put("amount", donation.getAmount() + " kg");
            details.put("logo", donation.getDonorUser() != null ? donation.getDonorUser().getProfilePic() : donation.getImage()); // Prefer donor pic, fallback to item image

            donationDetails.add(details);
        }

        return ResponseEntity.ok(donationDetails);
    }

    @GetMapping("/home/foodbank/{userId}/top-donors")
    public ResponseEntity<?> getTopDonors(@PathVariable Long userId) {
        TestUser foodBank = userRepository.findById(userId).orElse(null);
        if (foodBank == null) {
            return ResponseEntity.notFound().build();
        }

        // Fetch donations SPECIFICALLY for this food bank
        List<FoodDonation> foodBankDonations = donationRepository.findByFoodBank_UserID(userId); // <-- FIX: Fetch only relevant donations

        // Count donations by donor
        Map<TestUser, Long> donationCount = new HashMap<>();
        for (FoodDonation donation : foodBankDonations) {
            // Use getDonorUser() for the actual donor
            if (donation.getDonorUser() != null) {
                donationCount.put(
                    donation.getDonorUser(),
                    donationCount.getOrDefault(donation.getDonorUser(), 0L) + 1
                );
            }
        }

        // Sort by donation count and take top 5
        List<Map.Entry<TestUser, Long>> topDonors = donationCount.entrySet().stream()
                .sorted(Map.Entry.<TestUser, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<Map<String, Object>> donorDetails = new ArrayList<>();
        for (Map.Entry<TestUser, Long> entry : topDonors) {
            TestUser donor = entry.getKey();
            Long count = entry.getValue();

            Map<String, Object> details = new HashMap<>();
            details.put("id", donor.getUserID());
            details.put("name", donor.getName());
            details.put("donations", count);
            details.put("logo", donor.getProfilePic());

            donorDetails.add(details);
        }

        return ResponseEntity.ok(donorDetails);
    }

    // getNeededItems method remains largely the same as it relies on parsing 'about' text
    @GetMapping("/home/foodbank/{userId}/needed-items")
    public ResponseEntity<?> getNeededItems(@PathVariable Long userId) {
        TestUser foodBank = userRepository.findById(userId).orElse(null);
        if (foodBank == null) {
            return ResponseEntity.notFound().build();
        }

        String aboutText = foodBank.getAbout();
        List<Map<String, Object>> neededItems = new ArrayList<>();

        if (aboutText != null) {
             // Improved regex to handle different phrasing and potential surrounding text
            String regex = "(?i)(?:What we need most:|Looking for:|In need of:)\\s*([^\\n]+)";
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile(regex).matcher(aboutText);

            if (matcher.find()) {
                String itemsText = matcher.group(1).trim();
                // Split by common delimiters like comma, 'and', bullet points (•, *)
                 String[] items = itemsText.split("\\s*(?:,|\\band\\b|[•*])\\s*");

                for (int i = 0; i < items.length && i < 5; i++) {
                    String itemName = items[i].trim();
                     if (itemName.isEmpty()) continue; // Skip empty items

                    Map<String, Object> item = new HashMap<>();
                    item.put("id", i + 1);
                    item.put("name", itemName);

                    String priority;
                    if (i == 0) priority = "High";
                    else if (i <= 2) priority = "Medium"; // First 3 items are high/medium
                    else priority = "Low";

                    item.put("priority", priority);
                     // Generic description, can be refined
                    item.put("description", "Essential item requested by the food bank");

                    neededItems.add(item);
                }
            }
        }

        if (neededItems.isEmpty()) {
            // Default items if parsing fails or no needs are listed
            String[][] defaultItems = {
                {"Canned Protein", "High", "Tuna, chicken, beans and other high-protein canned goods"},
                {"Baby Products", "Medium", "Formula, diapers, baby food and other infant necessities"},
                {"Pasta & Rice", "Medium", "Dried pasta, rice, and other shelf-stable grains"},
                {"Toiletries", "Low", "Soap, shampoo, toothpaste, and other personal care items"},
                {"Cooking Oil", "Low", "Vegetable oil, olive oil, and other cooking oils"}
            };

            for (int i = 0; i < defaultItems.length; i++) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", i + 1);
                item.put("name", defaultItems[i][0]);
                item.put("priority", defaultItems[i][1]);
                item.put("description", defaultItems[i][2]);
                neededItems.add(item);
            }
        }

        return ResponseEntity.ok(neededItems);
    }
}