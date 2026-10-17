package com.FDS.API.TestUser;

public class FoodBankDTO {
    private Long userID;
    private String name;
    private String profilePic;
    private String about;
    private String email;

    public FoodBankDTO(TestUser user) {
        this.userID = user.getUserID();
        this.name = user.getName();
        this.profilePic = user.getProfilePic();
        this.about = user.getAbout();
        this.email = user.getEmail();
    
}

    public Long getUserID() {
        return userID;
    }

    public String getName() {
        return name;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public String getAbout() {
        return about;
    }

    public String getEmail() {
        return email;
    }
}
