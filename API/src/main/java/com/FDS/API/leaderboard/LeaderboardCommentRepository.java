package com.FDS.API.leaderboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaderboardCommentRepository extends JpaRepository<LeaderboardComment, Long> {
    List<LeaderboardComment> findAllByOrderByCreatedAtDesc();
    List<LeaderboardComment> findByUserUserID(Long userId);
}