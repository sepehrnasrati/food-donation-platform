package com.FDS.API.leaderboard;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.AccountType;
import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    
    @Autowired
    private LeaderboardRepository leaderboardRepository;
    
    @Autowired
    private TestUserRepository userRepository;
    
    @GetMapping("/{periodType}")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard(
            @PathVariable String periodType,
            @RequestParam(value = "businessOnly", defaultValue = "false") boolean businessOnly) {
        
        // Validate periodType is one of "week", "month", "year"
        if (!periodType.equals("week") && !periodType.equals("month") && !periodType.equals("year")) {
            return ResponseEntity.badRequest().build();
        }
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        
        switch (periodType) {
            case "week":
                startDate = endDate.minusWeeks(1);
                break;
            case "month":
                startDate = endDate.minusMonths(1);
                break;
            case "year":
                startDate = endDate.minusYears(1);
                break;
            default:
                startDate = endDate.minusYears(1);
        }
        
        List<Object[]> results = leaderboardRepository.findDonationStatsByDateRange(startDate, endDate);
        List<LeaderboardDTO> dtos = new ArrayList<>();
        
        for (Object[] result : results) {
            Long donorId = ((Number) result[0]).longValue();
            
            // If we're filtering for business users only, check user type
            if (businessOnly) {
                TestUser donor = userRepository.findById(donorId).orElse(null);
                if (donor == null || donor.getAccountType() != AccountType.BUSINESS) {
                    continue; // Skip non-business users
                }
            }
            
            String donorName = (String) result[1];
            Long donationCount = ((Number) result[2]).longValue();
            Double totalAmount = ((Number) result[3]).doubleValue();
            
            dtos.add(new LeaderboardDTO(donorId, donorName, donationCount, totalAmount));
        }
        
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/business-only/{periodType}")
    public ResponseEntity<List<LeaderboardDTO>> getBusinessLeaderboard(@PathVariable String periodType) {
        return getLeaderboard(periodType, true);
    }
    
    @GetMapping("/rank/{userId}/{periodType}")
    public ResponseEntity<Integer> getUserRank(
            @PathVariable Long userId,
            @PathVariable String periodType,
            @RequestParam(value = "businessOnly", defaultValue = "false") boolean businessOnly) {
        
        // Get the full leaderboard
        ResponseEntity<List<LeaderboardDTO>> leaderboardResponse = getLeaderboard(periodType, businessOnly);
        
        if (!leaderboardResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(leaderboardResponse.getStatusCode()).build();
        }
        
        List<LeaderboardDTO> leaderboard = leaderboardResponse.getBody();
        
        // Find the position of the user in the leaderboard
        int rank = -1;
        for (int i = 0; i < leaderboard.size(); i++) {
            if (leaderboard.get(i).getId().equals(userId)) {
                rank = i + 1; // +1 because ranks are 1-based, not 0-based
                break;
            }
        }
        
        if (rank == -1) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(rank);
    }
}