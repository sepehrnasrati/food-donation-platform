package com.FDS.API.TestUser;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.FDS.API.FoodDonation.FoodDonation;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import jakarta.persistence.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "TestUsers")
public class TestUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
	private Long userID;

    @NotBlank
    private String name;

    @NotBlank
    private String profilePic;

    @Email
    private String email;

    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING) // Stores the enum as a string in the database
	private AccountType accountType;

    @Column(length = 500) // Allow up to 500 characters
    private String about; // Businesses & food banks can provide extra information

    @CreationTimestamp
	private Date createdAt;

        // One-to-Many relationship with FoodDonation
    @OneToMany(mappedBy = "foodBank", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FoodDonation> foodDonations;

    public TestUser() {
        // Auto-generated constructor stub
        super();
    }

    public TestUser(String name, String profilePic, String email, String password, AccountType accountType, String about) {
        this.name = name;
        this.profilePic = profilePic;
        this.email = email;
        this.password = password;
        this.accountType = accountType;
        this.about = about;
    }

    // getters and setters
    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

}