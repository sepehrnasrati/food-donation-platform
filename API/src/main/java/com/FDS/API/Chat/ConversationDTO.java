package com.FDS.API.Chat;

import java.util.Date;

import com.FDS.API.TestUser.AccountType;

public class ConversationDTO {
    private long conversationID;
    private Date creationDate;
    private long accountID;
    private String accountName;
    private AccountType accountType;
    private String profilePic;

    public ConversationDTO(long conversationID, Date creationDate, long accountID, String accountName, AccountType accountType, String profilePic) {
        this.conversationID = conversationID;
        this.creationDate = creationDate;
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountType = accountType;
        this.profilePic = profilePic;
    }

    // getters and setters
    public long getConversationID() {
        return conversationID;
    }
    public void setConversationID(long conversationID) {
        this.conversationID = conversationID;
    }
    public Date getCreationDate() {
        return creationDate;
    }
    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }
    public long getAccountID() {
        return accountID;
    }
    public void setAccountID(long accountID) {
        this.accountID = accountID;
    }
    public String getAccountName() {
        return accountName;
    }
    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }
    public AccountType getAccountType() {
        return accountType;
    }
    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
    public String getProfilePic() {
        return profilePic;
    }
    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
}