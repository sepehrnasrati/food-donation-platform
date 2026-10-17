package com.FDS.API.Chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

@Controller
public class ChatController {

    @Autowired
    private TestUserRepository userRepo;

    @Autowired
    private ConversationRepository convoRepo;

    @Autowired
    private MessageRepository messageRepo;

    @MessageMapping("/chat/{conversationId}/send")
    @SendTo("/topic/chat/{conversationId}")
    public Object handleNewMessage(@DestinationVariable long conversationId, MessageSendDTO messageDTO) {
        
        // check if user exists
        TestUser user = userRepo.findById(messageDTO.getSenderID()).orElse(null);
        if (user == null) {
            return "{\"error\": \"Error: Failed to send message, could not find user with ID " + messageDTO.getSenderID() + ".\"}";
        }
        
        Conversation conversation = convoRepo.findById(messageDTO.getConversationID()).orElse(null);
        if (conversation == null) {
            return "{\"error\": \"Error: Failed to send message, conversation not found.\"}";    
        }
        Message savedMessage = new Message(conversation, user, messageDTO.getContent());
        messageRepo.save(savedMessage);

        MessageReturnDTO savedMessageDTO = new MessageReturnDTO(savedMessage.getId(), savedMessage.getConversation().getId(), savedMessage.getSender().getUserID(), savedMessage.getContent());
        return savedMessageDTO;
    }
}