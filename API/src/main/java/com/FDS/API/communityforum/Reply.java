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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "PostReplies")
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id")
    private Long replyID;

    @NotBlank
    private String replyBody;

    @CreationTimestamp
	private Date replyDate;

    @ManyToOne(fetch = FetchType.LAZY) // multiple replies can belong to one post
    @JoinColumn(name = "post_id", nullable = false)  // Foreign key to Post table
    private ForumPost post;

    @ManyToOne(fetch = FetchType.LAZY) // each reply is associated with a user
    @JoinColumn(name = "user_id", nullable = false)  // Foreign key to User table
    private TestUser author;

    public Reply() {
        // Auto-generated constructor stub
        super();
    }

    public Reply(String replyBody, ForumPost post, TestUser author) {
        this.replyBody = replyBody;
        this.post = post;
        this.author = author;
    }

    // Getters and Setters
    public Long getReplyID() {
        return replyID;
    }

    public void setReplyID(Long replyID) {
        this.replyID = replyID;
    }

    public String getReplyBody() {
        return replyBody;
    }

    public void setReplyBody(String replyBody) {
        this.replyBody = replyBody;
    }

    public Date getReplyDate() {
        return replyDate;
    }

    public void setReplyDate(Date replyDate) {
        this.replyDate = replyDate;
    }

    public ForumPost getPost() {
        return post;
    }

    public void setPost(ForumPost post) {
        this.post = post;
    }

    public TestUser getAuthor() {
        return author;
    }

    public void setAuthor(TestUser author) {
        this.author = author;
    }
}
