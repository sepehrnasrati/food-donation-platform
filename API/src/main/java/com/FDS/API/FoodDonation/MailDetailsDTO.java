package com.FDS.API.FoodDonation;

public class MailDetailsDTO {
    private String toMail;
    private String subject;
    private String message;

    public MailDetailsDTO() {
    }

    public MailDetailsDTO(String toMail, String subject, String message) {
        this.toMail = toMail;
        this.subject = subject;
        this.message = message;
    }

    public String getToMail() {
        return toMail;
    }

    public void setToMail(String toMail) {
        this.toMail = toMail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
