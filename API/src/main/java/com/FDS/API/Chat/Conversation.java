package com.FDS.API.Chat;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import com.FDS.API.TestUser.TestUser;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user1_id", nullable = false)
    private TestUser user1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user2_id", nullable = false)
    private TestUser user2;

    @CreationTimestamp
	private Date creationDate;

    
    public Conversation() {
        super();
    }

    public Conversation(TestUser user1, TestUser user2) {
        this.user1 = user1;
        this.user2 = user2;
    }

    // getters and setters
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public TestUser getUser1() {
        return user1;
    }

    public void setUser1(TestUser user1) {
        this.user1 = user1;
    }

    public TestUser getUser2() {
        return user2;
    }

    public void setUser2(TestUser user2) {
        this.user2 = user2;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }
}