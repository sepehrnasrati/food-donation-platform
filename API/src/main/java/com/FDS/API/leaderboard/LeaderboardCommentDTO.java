package com.FDS.API.leaderboard;

import java.util.Date;
import java.util.Set;

public class LeaderboardCommentDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userProfilePic;
    private String content;
    private Date createdAt;
    private Date updatedAt;
    private int likeCount;
    private boolean likedByCurrentUser;
    private Set<Long> likedByUserIds;

    // Constructors
    public LeaderboardCommentDTO() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserProfilePic() {
        return userProfilePic;
    }

    public void setUserProfilePic(String userProfilePic) {
        this.userProfilePic = userProfilePic;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public Set<Long> getLikedByUserIds() {
        return likedByUserIds;
    }

    public void setLikedByUserIds(Set<Long> likedByUserIds) {
        this.likedByUserIds = likedByUserIds;
    }
}