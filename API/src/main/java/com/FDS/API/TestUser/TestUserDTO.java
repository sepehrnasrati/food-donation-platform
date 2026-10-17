package com.FDS.API.TestUser;

import java.util.Date;

public class TestUserDTO {

    private Long userID;
    private AccountType accountType;
    private String name;
    private String email;
    private String profilePic;
    private String about;
    private Date createdAt;
    
    public TestUserDTO(Long userID, AccountType accountType, String name, String email, String profilePic, String about, Date createdAt) {
        this.userID = userID;
        this.accountType = accountType;
        this.name = name;
        this.email = email;
        this.profilePic = profilePic;
        this.about = about;
        this.createdAt = createdAt;
    }

    // getters setters
    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
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