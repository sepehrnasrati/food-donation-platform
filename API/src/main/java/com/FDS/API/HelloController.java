package com.FDS.API;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// the purpose of this controller is to initially check (from the frontend) if the backend application is running or not.
// this controller does not require a header token

@RestController
public class HelloController {
    @GetMapping("/hello")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Hello! Backend is running.");
    }
    @GetMapping("/dashboard-test")
    public String dashboardTest() {
    return "Dashboard test endpoint is working!";
}
}
 