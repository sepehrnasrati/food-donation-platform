package com.FDS.API.Chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.AccountType;
import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;
import com.FDS.API.communityforum.ValidationService;

@RestController
@RequestMapping("/chat")
public class ConversationController {

    @Autowired
    private ConversationRepository convoRepo;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private TestUserRepository userRepo;

    // get all conversations
    @GetMapping("/conversations")
    public ResponseEntity<?> getAllConversations(@RequestParam Long currentUserID) {
        ResponseEntity<Map<String, String>> userCheckResponse = validationService.checkIfUserExists(currentUserID);
        if (userCheckResponse != null) {
            return userCheckResponse; // user not found, return error
        }

        List<Conversation> conversationList = convoRepo.findConversationsByUserId(currentUserID);
        if (conversationList.size() == 0) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        } else {
            List<ConversationDTO> convoDTOs = new ArrayList<>();

            // create DTOs
            for (Conversation convo : conversationList) {
                // either user could be the current user. We only need the "target" user's ID (whoever current user wants to chat with)
                TestUser user1 = convo.getUser1();
                TestUser user2 = convo.getUser2();
                
                long userID = user1.getUserID();
                String name = user1.getName();
                AccountType accountType = user1.getAccountType();
                String profilePic = user1.getProfilePic();
                if (user1.getUserID().equals(currentUserID)) {
                    userID = user2.getUserID();
                    name = user2.getName();
                    accountType = user2.getAccountType();
                    profilePic = user2.getProfilePic();
                }
                ConversationDTO convoDTO = new ConversationDTO(convo.getId(), convo.getCreationDate(), userID, name, accountType, profilePic);
                convoDTOs.add(convoDTO);
            }
            return ResponseEntity.ok(convoDTOs);
        }
    }

    // create a new conversation between 2 users
    // Returns: conversationID
    @PostMapping("/conversations")
    public ResponseEntity<?> createConversation(@RequestParam Long userId1, @RequestParam Long userId2) {
        // check if the users exists
        ResponseEntity<Map<String, String>> userCheckResponse1 = validationService.checkIfUserExists(userId1);
        if (userCheckResponse1 != null) return userCheckResponse1; // user 1 not found
        TestUser user1 = userRepo.findById(userId1).get();

        ResponseEntity<Map<String, String>> userCheckResponse2 = validationService.checkIfUserExists(userId2);
        if (userCheckResponse2 != null) return userCheckResponse2; // user 2 not found
        TestUser user2 = userRepo.findById(userId2).get();
        
        // check if the users already have an existing convo
        Optional<Conversation> existingConvo = convoRepo.findExistingConversation(userId1, userId2);
        if (existingConvo.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(existingConvo.get().getId());
        } else {
            Conversation newConvo = new Conversation(user1, user2);
            convoRepo.save(newConvo);
            return ResponseEntity.status(HttpStatus.CREATED).body(newConvo.getId());
        }
    }
}