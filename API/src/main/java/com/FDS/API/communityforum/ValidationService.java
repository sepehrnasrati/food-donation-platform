package com.FDS.API.communityforum;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

@Service
public class ValidationService {

    private final ForumPostRepository forumRepo;
    private final TestUserRepository userRepo;

    public ValidationService(ForumPostRepository forumRepo, TestUserRepository userRepo) {
        this.forumRepo = forumRepo;
        this.userRepo = userRepo;
    }

    public ResponseEntity<Map<String, String>> checkIfPostExists(Long postID) {
        ForumPost post = forumRepo.findById(postID).orElse(null);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Post not found",
                "message", String.format("Post with ID %d does not exist", postID)
            ));
        }
        return null;
    }

    public ResponseEntity<Map<String, String>> checkIfUserExists(Long userID) {
        TestUser user = userRepo.findById(userID).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "User not found",
                "message", String.format("User with ID %d does not exist", userID)
            ));
        }
        return null;
    }
}