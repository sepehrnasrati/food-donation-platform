package com.FDS.API.Chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends CrudRepository<Conversation, Long> {
    // find all conversations involving a specifc userId
    @Query("SELECT c FROM Conversation c WHERE c.user1.userID = :userId OR c.user2.userID = :userId")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    // this query checks if there is already an existing conversation
    @Query("SELECT c FROM Conversation c WHERE (c.user1.id = :userId1 AND c.user2.id = :userId2) OR (c.user1.id = :userId2 AND c.user2.id = :userId1)")
    Optional<Conversation> findExistingConversation(Long userId1, Long userId2);
}