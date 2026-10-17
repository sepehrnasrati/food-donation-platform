package com.FDS.API.communityforum;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

import jakarta.validation.Valid;

@RestController
public class ReplyController {
    @Autowired
    private TestUserRepository userRepo;

    @Autowired
    private ForumPostRepository forumRepo;

    @Autowired
    private ReplyRepository replyRepo;

    @Autowired
    private ValidationService validationService;

    // for creating a new reply
    @PostMapping("/forum/posts/{postID}/replies")
    public ResponseEntity<?> createReply(@PathVariable Long postID, @Valid @RequestBody ReplyCreationDTO replyDTO) {
        // check that the author exists
        ResponseEntity<Map<String, String>> userCheckResponse = validationService
                .checkIfUserExists(replyDTO.getAuthorID());
        if (userCheckResponse != null) {
            return userCheckResponse; // User not found, return error
        }
        TestUser author = userRepo.findById(replyDTO.getAuthorID()).get();

        // check that the post exists
        ResponseEntity<Map<String, String>> postCheckResponse = validationService.checkIfPostExists(postID);
        if (postCheckResponse != null) {
            return postCheckResponse; // post not found, return error
        }
        ForumPost post = forumRepo.findById(postID).get();

        Reply reply = new Reply(replyDTO.getReplyBody(), post, author);

        // add reply to db
        Reply savedReply = replyRepo.save(reply);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of(
                "message", author.getName() + " successfully replied to post " + postID,
                "replyID", savedReply.getReplyID()));
    }

    // get all replies
    @GetMapping("/forum/posts/{postID}/replies")
    public ResponseEntity<?> getAllRepliesForPost(@PathVariable Long postID) {
        // check that the post exists
        ResponseEntity<Map<String, String>> postCheckResponse = validationService.checkIfPostExists(postID);
        if (postCheckResponse != null) {
            return postCheckResponse; // post not found, return error
        }
        ForumPost post = forumRepo.findById(postID).get();
    
        // get all replies for the post sorted by date (newest)
        List<Reply> replies = replyRepo.findByPostOrderByReplyDateDesc(post);
        
        // create list of ReplyDTOs
        List<ReplyDTO> replyDTOs = new ArrayList<>();
        for (Reply reply : replies) {
            ReplyDTO replyDTO = new ReplyDTO(
                reply.getReplyID(),
                reply.getReplyBody(),
                reply.getReplyDate(),
                reply.getAuthor().getUserID(),
                reply.getAuthor().getName(),
                reply.getAuthor().getProfilePic()
            );
            replyDTOs.add(replyDTO);
        }
    
        // return the list of replies as the response body
        return ResponseEntity.status(HttpStatus.OK).body(replyDTOs);
    }    
}
