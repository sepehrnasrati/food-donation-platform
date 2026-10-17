package com.FDS.API.communityforum;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface ReplyRepository extends CrudRepository<Reply, Long> {
    // Get all replies for a specific post sorted by replyDate in descending order
    List<Reply> findByPostOrderByReplyDateDesc(ForumPost post);
}
