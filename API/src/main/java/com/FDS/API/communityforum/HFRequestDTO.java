package com.FDS.API.communityforum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HFRequestDTO {
    @NotNull
    private Long authorID;

    @NotBlank
    private String postBody;

    public Long getAuthorID() {
        return authorID;
    }

    public void setAuthorID(Long authorID) {
        this.authorID = authorID;
    }

    public String getPostBody() {
        return postBody;
    }

    public void setPostBody(String postBody) {
        this.postBody = postBody;
    }
    
}
