package com.FDS.API.Chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class MessageController {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private ConversationRepository convoRepo;

    // GET previous messages for a particular conversation
    @GetMapping("/{conversationID}/messages")
    public ResponseEntity<?> getPreviousMessages(@PathVariable Long conversationID) {
        Conversation convo = convoRepo.findById(conversationID).orElse(null);
        if (convo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "error", "Conversation not found.",
                "message", String.format("Conversation with ID %d does not exist", conversationID)
            ));
        }

        List<Message> messageHistory = messageRepo.findByConversationIdOrderByTimestampAsc(conversationID);
        
        List<MessageReturnDTO> messageDTOs = new ArrayList<>();
        // create DTOs
        for (Message message : messageHistory) {
            MessageReturnDTO dto = new MessageReturnDTO(message.getId(), conversationID, message.getSender().getUserID(), message.getContent());
            messageDTOs.add(dto);
        }

        return ResponseEntity.ok(messageDTOs);
    }
}
