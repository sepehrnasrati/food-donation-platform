package com.FDS.API.communityforum;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

import jakarta.validation.Valid;

@RestController
public class HFController {
    
    @Autowired
    private HFService service;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private TestUserRepository userRepo;

    @PostMapping("/forum/ai-rewrite")
    public ResponseEntity<?> rewritePost(@Valid @RequestBody HFRequestDTO hfRequestDTO) {
        ResponseEntity<Map<String, String>> userCheckResponse = validationService
                .checkIfUserExists(hfRequestDTO.getAuthorID());
        if (userCheckResponse != null) {
            return userCheckResponse; // user not found, return error
        }
        String accountType = userRepo.findById(hfRequestDTO.getAuthorID()).get().getAccountType().name(); // get user's account type using .name() on the enum

        String accountTypeDescription = service.getAccountTypeDescription(accountType);
        String instruct = "You are an AI assistant on a community forum that helps users draft their posts. This community forum is part of a website that connects donors with food banks. The donors can be individuals or a business. Rewrite this draft post by " + accountTypeDescription + ". It should be a similar number of words to their original post.";
        ResponseEntity<?> response = service.getResponse(instruct, hfRequestDTO.getPostBody(), "rewritten text");
        return response;
    }

    @PostMapping("/forum/ai-summary")
    public ResponseEntity<?> summarisePost(@Valid @RequestBody HFRequestDTO hfRequestDTO) {
        ResponseEntity<Map<String, String>> userCheckResponse = validationService
                .checkIfUserExists(hfRequestDTO.getAuthorID());
        if (userCheckResponse != null) {
            return userCheckResponse; // User not found, return error
        }

        TestUser author = userRepo.findById(hfRequestDTO.getAuthorID()).get();
        String authorName = author.getName();

        String accountType = author.getAccountType().name();
        String accountTypeDescription = service.getAccountTypeDescription(accountType);

        String instruct = "You are an AI assistant on a community forum that helps generate summaries for posts. This community forum is part of a website that connects donors with food banks. The donors can be individuals or a business. Generate a summary " + authorName + "'s post, who is " + accountTypeDescription + " on this platform. Your summary should be 1-2 lines.";
        ResponseEntity<?> response = service.getResponse(instruct, hfRequestDTO.getPostBody(), "post summary");
        return response;
    }

    @PostMapping("/forum/ai-image")
    public ResponseEntity<?> generateImage(@Valid @RequestBody HFRequestDTO hfRequestDTO) {
        ResponseEntity<?> response = service.generateImage(hfRequestDTO.getPostBody());
        return response;
    }
}
