package com.FDS.API.communityforum;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

@RestController
public class LikesController {
    @Autowired
    private ForumPostRepository forumRepo;

    @Autowired
    private TestUserRepository userRepo;

    @Autowired
    private LikesRepository likesRepo;

    @Autowired
    private ValidationService validationService;
    
    @PostMapping("/forum/posts/{postID}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postID, @RequestParam Long currentUserID) {
        // check if post exists
        ResponseEntity<Map<String, String>> postCheckResponse = validationService.checkIfPostExists(postID);
        if (postCheckResponse != null) {
            return postCheckResponse; // post not found, return error
        }
        ForumPost post = forumRepo.findById(postID).get();
    
        // check if user exists
        ResponseEntity<Map<String, String>> userCheckResponse = validationService
                .checkIfUserExists(currentUserID);
        if (userCheckResponse != null) {
            return userCheckResponse; // User not found, return error
        }
        TestUser user = userRepo.findById(currentUserID).get();
    
        // check if the user has already liked this post
        boolean alreadyLiked = likesRepo.existsByPostPostIDAndUserUserID(postID, currentUserID);
        if (alreadyLiked) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "Already liked",
                    "message", "This user has already liked this post"
            ));
        }
    
        // Add the like
        Likes like = new Likes(user, post);
        likesRepo.save(like);
    
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Post liked successfully",
                "postID", postID,
                "userID", currentUserID
        ));
    }
    
    @DeleteMapping("/forum/posts/{postID}/like")
    public ResponseEntity<?> removeLike(@PathVariable Long postID, @RequestParam Long currentUserID) {
        // check if post exists
        ResponseEntity<Map<String, String>> postCheckResponse = validationService.checkIfPostExists(postID);
        if (postCheckResponse != null) {
            return postCheckResponse; // post not found, return error
        }
        ForumPost post = forumRepo.findById(postID).get();
    
        // check if user exists
        ResponseEntity<Map<String, String>> userCheckResponse = validationService
                .checkIfUserExists(currentUserID);
        if (userCheckResponse != null) {
            return userCheckResponse; // User not found, return error
        }
        TestUser user = userRepo.findById(currentUserID).get();
    
        // check if the user has liked this post
        Likes like = likesRepo.findByUserAndPost(user, post);
        if (like == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "Like not found",
                    "message", "Could not remove like as it does not exist"
            ));
        }
    
        // if so, delete the like
        likesRepo.delete(like);
    
        return ResponseEntity.ok(Map.of(
                "message", "Like removed successfully",
                "postID", postID,
                "userID", currentUserID
        ));
    }
    
}
