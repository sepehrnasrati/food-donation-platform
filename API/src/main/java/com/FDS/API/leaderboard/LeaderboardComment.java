package com.FDS.API.leaderboard;

import jakarta.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.FDS.API.TestUser.TestUser;

@Entity
@Table(name = "leaderboard_comments")
public class LeaderboardComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private TestUser user;

    @Column(nullable = false, length = 1000)
    private String content;

    @CreationTimestamp
    private Date createdAt;

    @UpdateTimestamp
    private Date updatedAt;

    @ManyToMany
    @JoinTable(
        name = "leaderboard_comment_likes",
        joinColumns = @JoinColumn(name = "comment_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<TestUser> likedBy = new HashSet<>();

    // Constructors
    public LeaderboardComment() {
    }

    public LeaderboardComment(TestUser user, String content) {
        this.user = user;
        this.content = content;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TestUser getUser() {
        return user;
    }

    public void setUser(TestUser user) {
        this.user = user;
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

    public Set<TestUser> getLikedBy() {
        return likedBy;
    }

    public void setLikedBy(Set<TestUser> likedBy) {
        this.likedBy = likedBy;
    }

    // Helper methods
    public void addLike(TestUser user) {
        this.likedBy.add(user);
    }

    public void removeLike(TestUser user) {
        this.likedBy.remove(user);
    }

    public boolean isLikedBy(TestUser user) {
        return this.likedBy.contains(user);
    }

    public int getLikeCount() {
        return this.likedBy.size();
    }
}