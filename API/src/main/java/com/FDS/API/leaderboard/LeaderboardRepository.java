package com.FDS.API.leaderboard;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.FDS.API.TestUser.TestUser;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> 
{
    List<LeaderboardEntry> findByDonationDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<LeaderboardEntry> findByDonorAndDonationDateBetween(TestUser donor, LocalDate startDate, LocalDate endDate);
    
    @Query
    (
            "SELECT le.donor.id as donorId, le.donor.name as donorName, " +
            "COUNT(le) as donationCount, SUM(le.amount) as totalAmount " +
            "FROM LeaderboardEntry le " +
            "WHERE le.donationDate BETWEEN :startDate AND :endDate " +
            "GROUP BY le.donor.id, le.donor.name " +
            "ORDER BY totalAmount DESC"
    )

    List<Object[]> findDonationStatsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}