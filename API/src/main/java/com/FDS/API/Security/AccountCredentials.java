package com.FDS.API.Security;

/*
 * this class is used for login and contains email and password as JSON, which are mapped to this class using jackson
 */
public class AccountCredentials {
    private String email;
	private String password;
    
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
}