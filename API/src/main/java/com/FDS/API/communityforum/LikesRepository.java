package com.FDS.API.communityforum;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.FDS.API.TestUser.TestUser;

public interface LikesRepository extends CrudRepository<Likes, Long> {
    boolean existsByUserAndPost(TestUser user, ForumPost post); // a like should only be added if it does not exist already

    // to check if current user has liked the post with this id 
    boolean existsByPostPostIDAndUserUserID(Long postId, Long userId);

    // Get a list of likes for current post
    @Query("SELECT like FROM Likes like WHERE like.post.postID = :postID")
    List<Likes> findLikesByPostId(@Param("postID") Long postID);

    // get specific like, used for deleting that like
    Likes findByUserAndPost(TestUser user, ForumPost post);
}