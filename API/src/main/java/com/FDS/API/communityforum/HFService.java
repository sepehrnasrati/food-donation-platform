package com.FDS.API.communityforum;

import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import org.springframework.core.io.Resource;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HFService {

    private final ObjectMapper objMapper;

    public HFService(ObjectMapper objMapper) {
        this.objMapper = objMapper;
    }

    public String getAccountTypeDescription(String accountType) {
        switch (accountType) {
            case "INDIVIDUAL":
                return "an individual";
            case "BUSINESS":
                return "a business";
            case "FOOD_BANK":
                return "a food bank";
            default:
                return "a forum user";
        }
    }

    private final String token = ":)";
    public ResponseEntity<?> getResponse(String instructString, String content, String expectedResponseType) {
        WebClient webClient = WebClient.builder()
            .baseUrl("https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct/v1/chat/completions")
            .defaultHeader("Authorization", "Bearer " + token)
            .defaultHeader("Content-Type", "application/json")
            .build();

        Map<String, Object> jsonBody = Map.of(
            "model", "microsoft/Phi-3-mini-4k-instruct",
            "messages", new Object[] {
                Map.of("role", "system", "content", instructString),
                Map.of("role", "user", "content", content)
            },
            "max_tokens", 500,
            "stream", false);

        String responseBody;
        try {
            responseBody = webClient.post()
                .bodyValue(jsonBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        } catch (WebClientResponseException exception) {
            responseBody = exception.getResponseBodyAsString();
        }

        String response;
        try {
            // read the JSON as a tree structure
            JsonNode rootNode = objMapper.readTree(responseBody);

            JsonNode choicesNode = rootNode.path("choices");
            if (choicesNode.isArray()) { // confirm json looks as expected
                response = choicesNode.get(0).path("message").path("content").asText();
                return ResponseEntity.ok(Map.of(expectedResponseType, response));
            } else {
                response = rootNode.get("error").asText();
                return ResponseEntity.internalServerError().body(Map.of(
                    "error", "HF error",
                    "message", response));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "HF error",
                "message", "The API did not return a valid JSON format."));
        }
    }

    public ResponseEntity<?> generateImage(String instructString) {
        WebClient webClient = WebClient.builder()
            .baseUrl("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium-diffusers")
            .defaultHeader("Authorization", "Bearer " + token)
            .defaultHeader("Content-Type", "application/json")
            .exchangeStrategies(ExchangeStrategies.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(3 * 1024 * 1024)) // this increases buffer size to 3 MB
                .build())
            .build();

        Map<String, Object> jsonBody = Map.of("inputs", instructString);

        try {
            byte[] imageBytes = webClient.post()
                .uri("")
                .bodyValue(jsonBody)
                .retrieve()
                .bodyToMono(byte[].class)
                .block();

            Resource imageResource = new ByteArrayResource(imageBytes);
            return ResponseEntity.ok()
                .header("Content-Type", "image/png")
                .body(imageResource);

        } catch (WebClientResponseException e) {
            System.out.println("\nError: " + e.getLocalizedMessage());

            String errorBody = e.getResponseBodyAsString();
            ObjectMapper mapper = new ObjectMapper();

            JsonNode errorJson = null;
            try {
                errorJson = mapper.readTree(errorBody);
            } catch (JsonProcessingException e1) {
                e1.printStackTrace();
            }

            String detailedError = e.getLocalizedMessage();
            if (errorJson != null && errorJson.has("error")) {
                detailedError = errorJson.get("error").asText();
            }

            return ResponseEntity.internalServerError()
            .body(Map.of(
                "error", "HF error",
                "message", detailedError));
        }
    }
}
