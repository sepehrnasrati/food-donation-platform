package com.FDS.API.Chat;

public class MessageReturnDTO {

    private long messageID;
    private long conversationID;
    private long senderID;
    private String content;

    public MessageReturnDTO(long messageID, long conversationID, long senderID, String content) {
        this.messageID = messageID;
        this.conversationID = conversationID;
        this.senderID = senderID;
        this.content = content;
    }

    public long getMessageID() {
        return messageID;
    }

    public void setMessageID(long messageID) {
        this.messageID = messageID;
    }
    
    public long getConversationID() {
        return conversationID;
    }

    public void setConversationID(long conversationID) {
        this.conversationID = conversationID;
    }

    public long getSenderID() {
        return senderID;
    }
    public void setSenderID(long senderID) {
        this.senderID = senderID;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
}