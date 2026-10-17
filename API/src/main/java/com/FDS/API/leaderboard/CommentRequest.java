package com.FDS.API.leaderboard;

// DTO for creating or updating a comment
public class CommentRequest {
    private String content;

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}