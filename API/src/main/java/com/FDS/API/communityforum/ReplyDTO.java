package com.FDS.API.communityforum;

import java.util.Date;

// This is a Data Transfer Object for replies to send only important info
public class ReplyDTO {
    private Long replyID;
    private String replyBody;
    private Date replyDate;
    private Long authorID;
    private String authorName;
    private String authorProfilePic;

    public ReplyDTO(Long replyID, String replyBody, Date replyDate, Long authorID, String authorName, String authorProfilePic) {
        this.replyID = replyID;
        this.replyBody = replyBody;
        this.replyDate = replyDate;
        this.authorID = authorID;
        this.authorName = authorName;
        this.authorProfilePic = authorProfilePic;
    }

    // Getters and setters
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

    public Long getAuthorID() {
        return authorID;
    }

    public void setAuthorID(Long authorID) {
        this.authorID = authorID;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorProfilePic() {
        return authorProfilePic;
    }

    public void setAuthorProfilePic(String authorProfilePic) {
        this.authorProfilePic = authorProfilePic;
    }
}
