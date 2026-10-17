package com.FDS.API.communityforum;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.FDS.API.TestUser.TestUser;
import com.FDS.API.TestUser.TestUserRepository;

@RestController
@RequestMapping("/forum/posts")
public class ForumPostController {

    @Autowired
    private TestUserRepository userRepo;

    @Autowired
    private ForumPostRepository forumRepo;

    @Autowired
    private LikesRepository likesRepo;

    @Autowired
    private ValidationService validationService;

    private final GoogleCloudService googleCloudService;

    @Autowired
    public ForumPostController(GoogleCloudService googleCloudService) {
        this.googleCloudService = googleCloudService;
    }

    // for creating a new post
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createForumPost(@RequestParam("postBody") String postBody, @RequestParam("authorID") Long authorID, @RequestParam(value = "image", required = false) MultipartFile image, @RequestParam(value = "eventLatitude", required = false) Double lat, @RequestParam(value = "eventLongitude", required = false) Double lon) {
        // check body is not empty
        if (postBody.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "Bad request",
                "message", "postBody is not valid"
            ));
        }

        // check that the author exists
        ResponseEntity<Map<String, String>> userCheckResponse = validationService
            .checkIfUserExists(authorID);
        if (userCheckResponse != null) {
            return userCheckResponse; // User not found, return error
        }
        TestUser author = userRepo.findById(authorID).get();

        String imageURL = null;
        if (image != null && !image.isEmpty()) { // attaching an image is optional
            if (googleCloudService.isGcsAvailable()) {
                imageURL = googleCloudService.uploadImage(image, "post");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "Backend error",
                    "message", "Failed to save image to Google Cloud Storage, the config file may be missing in the backend."));
            }
        }

        if (lat != null && lon != null) {
            if (lat < -90 || lat > 90) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Invalid latitude value",
                    "message", "Latitude values must be between -90 to 90"));
            } else if (lon < -180 || lon > 180) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Invalid longitude value",
                    "message", "Longitude values must be between -180 to 180"));
            }
        }

        ForumPost post = new ForumPost(postBody, imageURL, lat, lon, author);

        // add post to db
        ForumPost savedPost = forumRepo.save(post);

        return ResponseEntity.status(HttpStatus.CREATED)
            .header("Location", "/forum/posts/" + savedPost.getPostID())
            .body(Map.of("message", author.getName() + " successfully created a post", "postID",
                savedPost.getPostID()));
    }

    // get all posts
    @GetMapping()
    public ResponseEntity<?> getAllPosts(@RequestParam String sort, @RequestParam(required = false) Long currentUserID) {
        if (!sort.equals("latest") && !sort.equals("likes")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                "error", "Invalid sort parameter",
                "message", "Sort must be 'latest' or 'likes'"
            ));
        }
        if (currentUserID != null) {
            ResponseEntity<Map<String, String>> userCheckResponse = validationService.checkIfUserExists(currentUserID);
            if (userCheckResponse != null) {
                return userCheckResponse; // User not found, return error
            }
        }

        List<ForumPost> posts = new ArrayList<>();;
        // sort based on param
        if (sort.equals("latest")) {
            posts = (List<ForumPost>) forumRepo.findAllPostsSortedByLatest(); // sorting by date (newest)
        } else if (sort.equals("likes")) {
            posts = (List<ForumPost>) forumRepo.findAllPostsSortedByLikes(); // sorting by likes
        }
        
        List<ForumPostDTO> postDTOs = new ArrayList<>();
        // add each post to dto
        for (ForumPost post : posts) {
            // get number of likes for that post
            List<Likes> likes = likesRepo.findLikesByPostId(post.getPostID());
            Integer numLikes = likes.size();

            // check if that post has been liked by the current user
            boolean isLiked = false; // default to false if no user ID provided
            if (currentUserID != null) {
                isLiked = likesRepo.existsByPostPostIDAndUserUserID(post.getPostID(), currentUserID);
            }

            ForumPostDTO dto = new ForumPostDTO(post.getPostID(), post.getPostBody(), post.getPostImage(), post.getEventLatitude(), post.getEventLongitude(), post.getPostDate(), post.getAuthor().getUserID(), post.getAuthor().getName(), post.getAuthor().getAccountType(), post.getAuthor().getProfilePic(), numLikes, isLiked);
            postDTOs.add(dto);
        }
        return ResponseEntity.ok(postDTOs);
    }

    // Get single post by its id
    @GetMapping("/{postID}")
    public ResponseEntity<?> getPost(@PathVariable Long postID, @RequestParam(required = false) Long currentUserID) {
        ResponseEntity<Map<String, String>> postCheckResponse = validationService.checkIfPostExists(postID);
        if (postCheckResponse != null) {
            return postCheckResponse; // post not found, return error
        }

        if (currentUserID != null) {
            ResponseEntity<Map<String, String>> userCheckResponse = validationService.checkIfUserExists(currentUserID);
            if (userCheckResponse != null) {
                return userCheckResponse; // user not found, return error
            }
        }
        ForumPost post = forumRepo.findById(postID).get();

        // get number of likes for the post
        List<Likes> likes = likesRepo.findLikesByPostId(postID);
        int numLikes = likes.size();

        // check if post was liked by the current user
        boolean isLiked = false;
        if (currentUserID != null) {
            isLiked = likesRepo.existsByPostPostIDAndUserUserID(postID, currentUserID);
        }

        // create post DTO
        ForumPostDTO postDTO = new ForumPostDTO(
            post.getPostID(),
            post.getPostBody(),
            post.getPostImage(),
            post.getEventLatitude(),
            post.getEventLongitude(),
            post.getPostDate(),
            post.getAuthor().getUserID(),
            post.getAuthor().getName(),
            post.getAuthor().getAccountType(),
            post.getAuthor().getProfilePic(),
            numLikes,
            isLiked);

        return ResponseEntity.ok(postDTO);
    }

}
