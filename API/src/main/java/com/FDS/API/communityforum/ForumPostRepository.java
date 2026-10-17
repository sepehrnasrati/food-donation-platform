package com.FDS.API.communityforum;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface ForumPostRepository extends CrudRepository<ForumPost, Long> {
    // get all posts sorted by date (newest)
    @Query("SELECT f FROM ForumPost f ORDER BY f.postDate DESC")
    List<ForumPost> findAllPostsSortedByLatest();

    // get all posts sorted by number of likes
    @Query("SELECT f FROM ForumPost f LEFT JOIN Likes l ON f.postID = l.post.postID GROUP BY f.postID ORDER BY COUNT(l) DESC")
    List<ForumPost> findAllPostsSortedByLikes();
}
