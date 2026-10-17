package com.FDS.API.leaderboard;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Controller
@RequestMapping("/api/sse")
public class LeaderboardSSEController {

    // List of active SSE connections
    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @GetMapping("/leaderboard")
    public SseEmitter subscribeToLeaderboard() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Long timeout
        
        // Add the emitter to the list on creation
        this.emitters.add(emitter);
        
        // Remove the emitter when client disconnects or on error
        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
        emitter.onError((e) -> this.emitters.remove(emitter));
        
        // Send initial ping to establish the connection
        try {
            emitter.send(SseEmitter.event().name("PING").data("Connection established"));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }
        
        return emitter;
    }
    
    // Method to broadcast updates to all connected clients
    public void broadcastLeaderboardUpdate(LeaderboardUpdateDTO update) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        
        emitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event()
                    .name("LEADERBOARD_UPDATE")
                    .data(update));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });
        
        // Remove dead emitters
        emitters.removeAll(deadEmitters);
    }
}