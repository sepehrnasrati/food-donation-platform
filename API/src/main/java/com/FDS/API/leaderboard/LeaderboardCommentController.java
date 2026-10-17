package com.FDS.API.leaderboard;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

@RestController
@RequestMapping("/api/leaderboard/comments")
public class LeaderboardCommentController {

    @Autowired
    private LeaderboardCommentRepository commentRepository;

    @Autowired
    private TestUserRepository userRepository;

    // Get all comments
    @GetMapping
    public ResponseEntity<List<LeaderboardCommentDTO>> getAllComments(
            @RequestParam(value = "currentUserId", required = false) Long currentUserId) {
        List<LeaderboardComment> comments = commentRepository.findAllByOrderByCreatedAtDesc();
        
        List<LeaderboardCommentDTO> commentDTOs = comments.stream()
                .map(comment -> convertToDTO(comment, currentUserId))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(commentDTOs);
    }

    // Get a specific comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(
            @PathVariable Long id,
            @RequestParam(value = "currentUserId", required = false) Long currentUserId) {
        
        return commentRepository.findById(id)
                .map(comment -> ResponseEntity.ok(convertToDTO(comment, currentUserId)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new comment
    @PostMapping
    public ResponseEntity<?> createComment(
            @RequestBody CommentRequest request,
            @RequestParam Long userId) {
        
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Content is required"
            ));
        }

        TestUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "User not found"
            ));
        }

        LeaderboardComment comment = new LeaderboardComment(user, request.getContent());
        LeaderboardComment savedComment = commentRepository.save(comment);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedComment, userId));
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestBody CommentRequest request,
            @RequestParam Long userId) {
        
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Content is required"
            ));
        }

        LeaderboardComment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if the user is the owner of the comment
        if (!comment.getUser().getUserID().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "You can only edit your own comments"
            ));
        }

        comment.setContent(request.getContent());
        LeaderboardComment updatedComment = commentRepository.save(comment);
        
        return ResponseEntity.ok(convertToDTO(updatedComment, userId));
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        LeaderboardComment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if the user is the owner of the comment
        if (!comment.getUser().getUserID().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                "error", "You can only delete your own comments"
            ));
        }

        commentRepository.delete(comment);
        return ResponseEntity.noContent().build();
    }

    // Like a comment
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeComment(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        LeaderboardComment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }

        TestUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "User not found"
            ));
        }

        // Check if the user has already liked the comment
        if (comment.isLikedBy(user)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "You have already liked this comment"
            ));
        }

        comment.addLike(user);
        LeaderboardComment updatedComment = commentRepository.save(comment);
        
        return ResponseEntity.ok(convertToDTO(updatedComment, userId));
    }

    // Unlike a comment
    @DeleteMapping("/{id}/like")
    public ResponseEntity<?> unlikeComment(
            @PathVariable Long id,
            @RequestParam Long userId) {
        
        LeaderboardComment comment = commentRepository.findById(id).orElse(null);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }

        TestUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "User not found"
            ));
        }

        // Check if the user has liked the comment
        if (!comment.isLikedBy(user)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "You have not liked this comment"
            ));
        }

        comment.removeLike(user);
        LeaderboardComment updatedComment = commentRepository.save(comment);
        
        return ResponseEntity.ok(convertToDTO(updatedComment, userId));
    }

    // Helper method to convert entity to DTO
    private LeaderboardCommentDTO convertToDTO(LeaderboardComment comment, Long currentUserId) {
        LeaderboardCommentDTO dto = new LeaderboardCommentDTO();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUser().getUserID());
        dto.setUserName(comment.getUser().getName());
        dto.setUserProfilePic(comment.getUser().getProfilePic());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setLikeCount(comment.getLikeCount());
        
        Set<Long> likedByUserIds = comment.getLikedBy().stream()
                .map(TestUser::getUserID)
                .collect(Collectors.toSet());
        dto.setLikedByUserIds(likedByUserIds);
        
        if (currentUserId != null) {
            TestUser currentUser = userRepository.findById(currentUserId).orElse(null);
            if (currentUser != null) {
                dto.setLikedByCurrentUser(comment.isLikedBy(currentUser));
            }
        }
        
        return dto;
    }
}