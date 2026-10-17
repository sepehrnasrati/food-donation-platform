package com.FDS.API.communityforum;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import com.FDS.API.TestUser.TestUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "CommunityForum")
public class ForumPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
	private Long postID;

    @NotBlank
    @Lob // this is for larger text blocks
    private String postBody;

    private String postImage;

    private Double eventLatitude;
    private Double eventLongitude;

    @CreationTimestamp
	private Date postDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = false)  // Foreign key to User table
    private TestUser author;

    public ForumPost() {
        // Auto-generated constructor stub
        super();
    }

    public ForumPost(String postBody, String postImage, Double eventLatitude, Double eventLongitude, TestUser author) {
        this.postBody = postBody;
        this.postImage = postImage;
        this.eventLatitude = eventLatitude;
        this.eventLongitude = eventLongitude;
        this.author = author;
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

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
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

    public TestUser getAuthor() {
        return author;
    }

    public void setAuthor(TestUser author) {
        this.author = author;
    }
}
