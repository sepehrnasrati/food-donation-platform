package com.FDS.API.Chat;

public class MessageSendDTO {
    private long senderID;
    private long conversationID;
    private String content;

    public MessageSendDTO(long senderID, long conversationID, String content) {
        this.senderID = senderID;
        this.conversationID = conversationID;
        this.content = content;
    }

    public long getSenderID() {
        return senderID;
    }
    public void setSenderID(long senderID) {
        this.senderID = senderID;
    }
    public long getConversationID() {
        return conversationID;
    }
    public void setConversationID(long conversationID) {
        this.conversationID = conversationID;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
}
