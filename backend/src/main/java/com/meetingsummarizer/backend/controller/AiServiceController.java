package com.meetingsummarizer.backend.controller;

import com.meetingsummarizer.backend.ai.AiService;
import com.meetingsummarizer.backend.ai.dto.SummarizeResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiServiceController {

    private final AiService aiService;

    public AiServiceController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/summarize")
    public SummarizeResponse summarize(
            @RequestBody Map<String, String> request) {

        String transcript = request.get("transcript");

        return aiService.summarize(transcript);
    }
}