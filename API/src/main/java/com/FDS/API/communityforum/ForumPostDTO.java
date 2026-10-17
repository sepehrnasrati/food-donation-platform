package com.FDS.API.communityforum;

import java.util.Date;

import com.FDS.API.TestUser.AccountType;

// This is a Data Transfer Object for posts to send only important info
public class ForumPostDTO {
    private Long postID;
    private String postBody;
    private Date postDate;
    private String postImage;
    private Double eventLatitude;
    private Double eventLongitude;
    private long authorID;
    private String authorName;
    private AccountType authorAccountType;
    private String authorProfilePic;
    private Integer numLikes;
    private boolean likedByCurrentUser;

    public ForumPostDTO(Long postID, String postBody, String postImage, Double eventLatitude, Double eventLongitude, Date postDate, Long authorID, String authorName, AccountType authorAccountType, String authorProfilePic, Integer numLikes, boolean likedByCurrentUser) {
        this.postID = postID;
        this.postBody = postBody;
        this.postImage = postImage;
        this.eventLatitude = eventLatitude;
        this.eventLongitude = eventLongitude;
        this.postDate = postDate;
        this.authorID = authorID;
        this.authorName = authorName;
        this.authorAccountType = authorAccountType;
        this.authorProfilePic = authorProfilePic;
        this.numLikes = numLikes;
        this.likedByCurrentUser = likedByCurrentUser;
    }

    // Getters and Setters
    public Long getPostID() {
        return postID;
    }

    public void setPostID(Long postID) {
        this.postID = postID;
    }

    public String getPostBody() {
        return postBody;
    }

    public void setPostBody(String postBody) {
        this.postBody = postBody;
    }

    public String getPostImage() {
        return postImage;
    }

    public void setPostImage(String postImage) {
        this.postImage = postImage;
    }
    
    public Double getEventLatitude() {
        return eventLatitude;
    }

    public void setEventLatitude(Double eventLatitude) {
        this.eventLatitude = eventLatitude;
    }

    public Double getEventLongitude() {
        return eventLongitude;
    }

    public void setEventLongitude(Double eventLongitude) {
        this.eventLongitude = eventLongitude;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
    }

    public long getAuthorID() {
        return authorID;
    }

    public void setAuthorID(long authorID) {
        this.authorID = authorID;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorProfilePic() {
        return authorProfilePic;
    }
    
    public AccountType getAuthorAccountType() {
        return authorAccountType;
    }

    public void setAuthorAccountType(AccountType authorAccountType) {
        this.authorAccountType = authorAccountType;
    }

    public void setAuthorProfilePic(String authorProfilePic) {
        this.authorProfilePic = authorProfilePic;
    }

    public Integer getNumLikes() {
        return numLikes;
    }

    public void setNumLikes(Integer numLikes) {
        this.numLikes = numLikes;
    }

    public boolean getLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }
}